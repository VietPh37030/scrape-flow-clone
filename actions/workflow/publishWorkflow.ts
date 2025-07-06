"use server";
import { CalculateWorkflowCost } from "@/lib/helpers";
import { FlowExecutionPlan } from "@/lib/workflow/executionPlan";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function PublishWorkflow(
    {id,flowDefinition}:
    {
        id:string,
        flowDefinition:string
    }
) {
    const {userId} = auth();
    if(!userId){
        throw new Error("unauthorized");
    }
    const workflow = await prisma?.workflow.findUnique({
        where:{
            id,
            userId
        },
    });
    if(!workflow){
        throw new Error("workflow not found");
    }
    if(workflow.status !== WorkflowStatus.DRAFT){
        throw new Error("workflow is not draft");
    }
    const flow = JSON.parse(flowDefinition)
    const result= FlowExecutionPlan(flow.nodes,flow.edges);
    if(result.error){
        throw new Error("invalid flow definition");
    }
    if(!result.executionPlan){
        throw new Error("no execution plan  generated");
    }
    const creditsCost = CalculateWorkflowCost(flow.nodes);
    await prisma?.workflow.update({
        where:{
            id,userId
        },
        data:{
            definition:flowDefinition,
            executionPlan:JSON.stringify(result.executionPlan),
            status:WorkflowStatus.PUBLISHED,
            creditsCost
        }
    });
    revalidatePath(`/workflow/editor.${id}`)

}