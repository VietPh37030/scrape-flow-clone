import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { TaskRegistry } from "./task/registry";


export function CreateFlowNode(
    nodeType:TaskType,
    position?:{x:number;y:number}
):AppNode{
    const task = TaskRegistry[nodeType];
    const inputs: Record<string, string> = {};

    // Initialize all inputs from task definition
    task.inputs.forEach(input => {
        inputs[input.name] = "";
    });

    return {
        id: crypto.randomUUID(),
        type:"FlowScrapeNode",
        dragHandle:".drag-handle",
        data:{
            type:nodeType,
            inputs
        },
        position:position ?? {x:0,y:0}
    }
}
