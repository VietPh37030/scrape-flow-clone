"use server";

import { FlowExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowExecutionTrigger, WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { number } from "zod";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";

export async function RunWorkflow(
  form: {
    workflowId: string,
    flowDefinition?: string
  }
) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthorized");
  }
  const { workflowId, flowDefinition } = form;
  if (!workflowId) {
    throw new Error("workflowId is required");
  }
  const workflow = await prisma.workflow.findUnique({
    where: {
      userId,
      id: workflowId
    }
  });
  if (!workflow) {
    throw new Error("workflow not found");
  }
  let executionPlan: WorkflowExecutionPlan;
  if (workflow.status === WorkflowStatus.PUBLISHED) {
    if (!workflow.executionPlan) {
      throw new Error("no execution plan found in published workflow");
    }
    // executionPlan = JSON.parse(workflow.definition);

    executionPlan = JSON.parse(workflow.executionPlan);
  } else {
    //Draft
    if (!flowDefinition) {
      throw new Error("flow definition is required");
    }
    const flow = JSON.parse(flowDefinition);
    const result = FlowExecutionPlan(flow.nodes, flow.edges);
    if (result.error) {
      throw new Error("flow  definition not valid")
    }
    if (!result.executionPlan) {
      throw new Error("no execution plan genetated");
    }
    executionPlan = result.executionPlan;
  }


  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      startedAt: new Date(),
      trigger: WorkflowExecutionTrigger.MANUAL,
      definition: flowDefinition,
      phases: {
        create: executionPlan.flatMap(phase => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.PENDING,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          })
        })
      }
    },
    select: {
      id: true,
      phases: true
    },
  });
  if (!execution) {
    throw new Error("workflow exeution not created")
  }
  ExecuteWorkflow(execution.id); //Run this the background
  redirect(`/workflow/runs/${workflow.id}/${execution.id}`);
}