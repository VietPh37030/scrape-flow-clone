"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";
export async function unPublishWorkflow(id: string) {
    const {userId} = auth();
    if(!userId){
        throw new Error("unauthorized");
    }
    const workflow = await prisma.workflow.findUnique({
        where:{
            id,
            userId
            }
    });
    if(!workflow){
        throw new Error("workflow not found");
    }
    if(workflow.status !== WorkflowStatus.PUBLISHED){
        throw new Error("workflow is not published");
    }
    await prisma.workflow.update({
        data:{
            status:WorkflowStatus.DRAFT,
            executionPlan:null,
            creditsCost:0
        },
        where:{
            id,
            userId
        }
    });
    revalidatePath(`/workflow/editor/${id}`);

}