import "server-only";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "../generated/prisma";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Enviroment, ExecutionEnviroment } from "@/types/executor";
import { browser, env } from "process";
import { TaskParamType } from "@/types/task";
import { set } from "date-fns";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { log } from "console";
import { create } from "domain";
import { createLogCollector } from "../log";
export async function ExecuteWorkflow(
    executionId: string,
) {
    const execution = await prisma.workflowExecution.findUnique({
        where: {
            id: executionId
        },
        include: { workflow: true, phases: true }
    })
    if (!execution) {
        throw new Error("execution not found");
    }
    //TODO:setup  execution environment
    const enviroment: Enviroment = { phases: {} };
    await initializeWorkflowExecution(executionId, execution.workflowId);
    await initializePhaseStatus(execution)
    const edges = JSON.parse(execution.definition).edges as Edge[];

    
    let creditsConsumed = 0;
    let executionFailed = false;
    for (const phase of execution.phases) {

        //TODO:execute phase


        const phaseExecution = await 
        executeWorkflowPhase(phase, enviroment, edges,execution.userId);
        creditsConsumed += phaseExecution.creditsConsumed;
        if (!phaseExecution.success) {
            executionFailed = true;
            break
        }
    }
    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);
    // Revalidate the workflow runs page
    await cleanupEnviroment(enviroment);
    revalidatePath("workflow/runs");
}
async function initializeWorkflowExecution(executionId: string, workflowId: string) {
    await prisma.workflowExecution.update({
        where: { id: executionId },
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING
        }
    })
    await prisma.workflow.update({
        where: {
            id: workflowId,
        },
        data: {
            lastRunAt: new Date(),
            lastRunId: WorkflowExecutionStatus.RUNNING,
            lastRunStatus: executionId
        }
    })
}
async function initializePhaseStatus(execution: any) {
    await prisma.workflowExecution.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase: any) => phase.id)
            },

        },
        data: {
            status: ExecutionPhaseStatus.PENDING
        }
    })
}
async function finalizeWorkflowExecution(
    executionId: string,
    workflowId: string,
    executionFailed: boolean,
    creditsConsumed: number
) {
    const finalStatus = executionFailed ?
        WorkflowExecutionStatus.FAILED :
        WorkflowExecutionStatus.COMPLETED;
    await prisma.workflowExecution.update({
        where: {
            id: executionId
        },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            creditsConsumed
        }
    });
    await prisma.workflow.update({
        where: {
            id: workflowId,
            lastRunId: executionId
        },
        data: {
            lastRunAt: finalStatus,

        }
    }).catch((err) => {
        //ignore
        //This  means  that we  have  triggerd  other runs  for this  workflow
        // while  an execution was runing
        //
    })
}
async function executeWorkflowPhase(
    phase: ExecutionPhase,
    enviroment: Enviroment,
    edges: Edge[],
    userId: string
) {
    const logCollector = createLogCollector();
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode
    setupEnviromentForPhase(node, enviroment, edges);
    // Update  phase status
    await prisma.executionPhase.update({
        where: {
            id: phase.id
        },
        data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt,
            inputs: JSON.stringify(enviroment.phases[node.id].inputs)
        }
    });
    const creditsRequired = TaskRegistry[node.data.type].credits;
    let success = await decrementCredits(userId, creditsRequired, logCollector);
    const creditsConsumed = success ? creditsRequired : 0;

    if (success) {
        //We can  execute the phase if the credits are sufficient
        success = await executePhase(phase, node, enviroment, logCollector);

    }

    const outputs = enviroment.phases[node.id].outputs;
    await finalizePhase(phase.id, success, outputs, logCollector, creditsConsumed);
    return { success,creditsConsumed }
}
async function finalizePhase(
    phaseId: string,
    success: boolean,
    outputs: any,
    logCollector: LogCollector,
    creditsConsumed: number)
     {
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;
    await prisma.executionPhase.update({
        where: {
            id: phaseId
        },
        data: {
            status: finalStatus,
            completed: new Date(),
            outputs: JSON.stringify(outputs),
            creditsConsumed,
            logs: {
                createMany: {
                    data: logCollector.getAll().map(log => ({
                        message: log.message,
                        logLevel: log.level,
                        timestamp: log.timestamp
                    }))
                }
            }
        }
    })
}
async function executePhase(
    phase: ExecutionPhase,
    node: AppNode,
    enviroment: Enviroment,
    logCollector: LogCollector
): Promise<boolean> {
    const runFn = ExecutorRegistry[node.data.type];
    if (!runFn) {
        return false
    }
    const executionEnviroment: ExecutionEnviroment<any> = createExecutionEnviroment(
        node,
        enviroment,
        logCollector
    );
    return await runFn(executionEnviroment);
}
async function setupEnviromentForPhase(node: AppNode, enviroment: Enviroment, edges: Edge[]) {
    enviroment.phases[node.id] = { inputs: {}, outputs: {} };
    const inputs = TaskRegistry[node.data.type].inputs;
    for (const input of inputs) {
        if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
        const inputValue = node.data.inputs[input.name];
        if (inputValue) {
            enviroment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }
        // Get input value from outputs  in the enviroment 
        const connectedEdge = edges.find(
            (edge) => edge.target === node.id && edge.targetHandle === input.name);
        if (!connectedEdge) {
            console.error("Missing  edge the find", input.name, "Node id:", node.id);
            continue;
        }
        const outputValue =
            enviroment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!];
        enviroment.phases[node.id].inputs[input.name] = outputValue
    }
}
function createExecutionEnviroment(
    node: AppNode,
    enviroment: Enviroment,
    logCollector: LogCollector
): ExecutionEnviroment<any> {
    return {
        getInput: (name: string) => enviroment.phases[node.id]?.inputs[name],
        setOutput: (name: string, value: string) => {
            enviroment.phases[node.id].outputs[name] = value
        },
        getBrowser: () => enviroment.browser,
        setBrowser: (browser: Browser) => (enviroment.browser = browser),
        getPage: () => enviroment.page,
        setPage: (page: Page) => (enviroment.page = page),

        log: logCollector
    };
}
async function cleanupEnviroment(enviroment: Enviroment) {
    if (enviroment.browser) {
        await enviroment.browser.close().catch(err => console.error("cannot close browser"))
    }
}
async function decrementCredits(userId: string, amount: number, logCollector: LogCollector) {
    try {
        await prisma.userBalance.update({
            where: { userId, credits: { gte: amount } },
            data: { credits: { decrement: amount } }

        })
        return true
    } catch (error) {
        console.error(error);
        logCollector.error("Số dư không đủ");
        return false

    }
}