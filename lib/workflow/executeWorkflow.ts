import "server-only";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "../generated/prisma";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Enviroment } from "@/types/executor";
import { env } from "process";
export async function ExecuteWorkflow(executionId: string) {
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
    const enviroment:Enviroment = { phases: {} };
    await initializeWorkflowExecution(executionId, execution.workflowId);
    await initializePhaseStatus(execution)
    //TODO:initialize workflow execution
    //todo:initizlize phases status
    let creditsConsumed = 0;
    let executionFailed = false;
    for (const phase of execution.phases) {
        //TODO:execute phase
        //TODO:credits consumed
        const phaseExecution = await executeWorkflowPhase(phase,enviroment);
        if (!phaseExecution.success) {
            executionFailed = true;
            break
        }
    }
    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed);
    //TODO:finalize execution
    //TODO:clean up enviroment
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
async function executeWorkflowPhase(phase: ExecutionPhase,enviroment:Enviroment) {
    const startedAt = new Date();
    const node = JSON.parse(phase.node) as AppNode
    setupEnviromentForPhase(node,enviroment);
    // Update  phase status
    await prisma.executionPhase.update({
        where: {
            id: phase.id
        },
        data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt
        }
    });
    const creditsRequired = TaskRegistry[node.data.type].credits;
    console.log(`Executing  phase ${phase.name} with  ${creditsRequired} credits`);
    //TODO:decrement user  balancer (with required  credits)
    //Execution phasesimulation
    const success = await executePhase(phase, node,enviroment);
    await finalizePhase(phase.id, success);
    return { success }
}
async function finalizePhase(phaseId: string, success: boolean) {
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;
    await prisma.executionPhase.update({
        where: {
            id: phaseId
        },
        data: {
            status: finalStatus,
            completed: new Date()
        }
    })
}
async function executePhase(
    phase:ExecutionPhase,
    node:AppNode,
    enviroment:Enviroment):Promise<boolean> {
    const runFn = ExecutorRegistry[node.data.type];
    if(!runFn){
        return false
    }
     return await runFn(enviroment);
}
async function setupEnviromentForPhase(node:AppNode,enviroment:Enviroment) {
    enviroment.phases[node.id] = {inputs :{},outputs:{} };
    const inputs = TaskRegistry[node.data.type].inputs;
    for(const input of inputs){
        const inputValue = node.data.inputs[input.name];
        if(inputValue){
         enviroment.phases[node.id].inputs[input.name] = inputValue; 
         continue;  
        }
        // Get input value from outputs  in the enviroment 
        
    }
}