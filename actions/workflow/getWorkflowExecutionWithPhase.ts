"use server";

import { auth } from "@clerk/nextjs/server";
import { use } from "react";
import prisma from "@/lib/prisma";
export async function GetWorkflowExecutionWithPhase(executionId:string){
    const {userId} = auth();
    if(!userId){
        throw new Error("unauthorized");
    }
    return prisma.workflowExecution.findUnique({
        where:{
            id:executionId,
            userId
        },
        include:{
            phases:{
                orderBy:{
                    number:"asc"
                }
            }
        }
    })
}