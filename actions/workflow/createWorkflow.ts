"use server"

import prisma from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchematype } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
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
    const result = await prisma.workflow.create({
        data:{
            userId,
            status:WorkflowStatus.DRAFT,
            definition:"TODO",
            ...data
        }
    })
    if (!result) {
        throw new Error("failed to create workflow")
    }
    redirect(`/workflow/editor/${result.id}`)
}
