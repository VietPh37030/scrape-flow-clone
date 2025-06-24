"use server"

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { createWorkflowSchema, createWorkflowSchematype } from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";

import { z } from "zod";

export async function CreateWorkflow(form: createWorkflowSchematype) {
    const { success, data } = createWorkflowSchema.safeParse(form);
    if (!success) {
        throw new Error("Invalid form data");
    }
    const {userId} = auth();
    if (!userId) {
        throw new Error("unauthorized");
    }
    const initianlFlow:{nodes:AppNode[];edges:Edge[]}={
        nodes: [],
        edges: []
    }
    //Let add the flow entry point
    initianlFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER))
    const result = await prisma.workflow.create({
        data:{
            userId,
            status:WorkflowStatus.DRAFT,
            definition:JSON.stringify(initianlFlow),
            ...data
        }
    })
    if (!result) {
        throw new Error("failed to create workflow")
    }
    redirect(`/workflow/editor/${result.id}`)
}
