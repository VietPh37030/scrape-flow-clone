import { AppNode, AppNodeMissingInput } from "@/types/appNode";
import { WorkflowExecutionPlan, WorkflowExecutionPlanPhase } from "@/types/workflow";
import { Edge } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";
export enum FlowToExecutionPlanValidationError {
    "NO_ENTRY_POINT",
    "INVALID_INPUTS"
}
type FlowToExecutionPlanType = {
    executionPlan?: WorkflowExecutionPlan;
    error?: {
        type: FlowToExecutionPlanValidationError;
        invalidInputs?: AppNodeMissingInput[];
    }
};
export function FlowExecutionPlan(
    nodes: AppNode[], edges: Edge[])
    : FlowToExecutionPlanType {
    const entryPoint = nodes.find(
        (node) => TaskRegistry[node.data.type].isEntryPoint
    )
    if (!entryPoint) {
        return {
            error: {
                type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT
            }
        }
    }
    const inputWithErrors: AppNodeMissingInput[] = [];
    const planned = new Set<string>();
    const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
    if (invalidInputs.length > 0) {
        inputWithErrors.push({
            nodeId: entryPoint.id,
            input: invalidInputs,

        })
    }
    planned.add(entryPoint.id);
    const executionPlan: WorkflowExecutionPlan = [
        {
            phase: 1,
            nodes: [entryPoint]
        }
    ];
    planned.add(entryPoint.id);
    for (let phase = 2;
        phase <= nodes.length && planned.size < nodes.length;
        phase++
    ) {
        console.log(`Processing phase ${phase}, planned nodes:`, planned.size, 'total nodes:', nodes.length);
        const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };
        const nodesAddedThisPhase: string[] = [];

        for (const currentNode of nodes) {
            if (planned.has(currentNode.id)) {
                //node already put in the execution plan
                continue;
            }
            const invalidInputs = getInvalidInputs(currentNode, edges, planned);
            console.log(`Node ${currentNode.data.type} (${currentNode.id}):`,
                'invalidInputs:', invalidInputs);
            console.log('Current planned nodes:', Array.from(planned));

            if (invalidInputs.length > 0) {
                const incomers = getIncomers(currentNode, nodes, edges)
                console.log(`Node ${currentNode.data.type} has incomers:`,
                    incomers.map(n => n.data.type));
                if (incomers.every(incomer => planned.has(incomer.id))) {
                    //IF all incoming incomers/edges are planned and there are still invalid inputs
                    //This means that this particular node has an invalid input
                    // which means that the workflow is invalid
                    console.error("invalid error", currentNode.id, invalidInputs);
                    inputWithErrors.push({
                        nodeId: currentNode.id,
                        input: invalidInputs,

                    })
                } else {
                    //Let skip node for now - dependencies not ready
                    console.log(`Skipping node ${currentNode.data.type} - dependencies not ready`);
                    continue;
                }
            } else {
                // No invalid inputs, node is ready to be executed
                console.log(`Adding node ${currentNode.data.type} to phase ${phase}`);
                nextPhase.nodes.push(currentNode);
                nodesAddedThisPhase.push(currentNode.id);
            }
        }

        // Add all nodes from this phase to planned AFTER processing all nodes
        nodesAddedThisPhase.forEach(nodeId => planned.add(nodeId));

        console.log(`Phase ${phase} completed with ${nextPhase.nodes.length} nodes`);
        // Only add phase if it has nodes
        if (nextPhase.nodes.length > 0) {
            executionPlan.push(nextPhase);
        }
        if(inputWithErrors.length > 0){
            return {
                error: {
                    type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
                    invalidInputs: inputWithErrors
                }
            }
        }
    }
    return { executionPlan };


}
function getInvalidInputs(node: AppNode, edges: Edge[], planned: Set<string>) {
    const invalidInputs = [];
    const inputs = TaskRegistry[node.data.type].inputs;
    console.log(`\n=== Checking inputs for ${node.data.type} ===`);
    console.log('Node inputs data:', node.data.inputs);
    console.log('Incoming edges:', edges.filter(e => e.target === node.id));
    console.log('Planned nodes:', Array.from(planned));

    for (const input of inputs) {
        console.log(`\nChecking input: ${input.name} (required: ${input.require})`);
        const inputValue = node.data.inputs[input.name];
        const inputValueProvide = inputValue?.length > 0;
        console.log(`Input value: "${inputValue}", provided: ${inputValueProvide}`);

        if (inputValueProvide) {
            //This input is fine, so we can move on
            console.log(`✓ Input ${input.name} has user value`);
            continue
        }

        // If value is not provided by the user then we need to check
        //if there is an output linked to the current input
        const incomingEdges = edges.filter((edges) => edges.target === node.id);
        const inputLinkedToOutput = incomingEdges.find((edge) => edge.targetHandle === input.name);
        console.log(`Input linked to output:`, inputLinkedToOutput);

        if (input.require && inputLinkedToOutput) {
            const sourceNodePlanned = planned.has(inputLinkedToOutput.source);
            console.log(`Required input ${input.name} linked to ${inputLinkedToOutput.source}, source planned: ${sourceNodePlanned}`);
            if (sourceNodePlanned) {
                console.log(`✓ Required input ${input.name} satisfied by planned node`);
                continue;
            } else {
                console.log(`✗ Required input ${input.name} linked but source not planned yet`);
                invalidInputs.push(input.name);
            }
        } else if (input.require && !inputLinkedToOutput) {
            console.log(`✗ Required input ${input.name} has no value and no connection`);
            invalidInputs.push(input.name);
        } else if (!input.require) {
            //IF the input is not required but there is an output linked to it
            //Then we need to be sure that the  output is aldready planned
            if (!inputLinkedToOutput) {
                console.log(`✓ Optional input ${input.name} not connected - OK`);
                continue;
            }
            if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
                console.log(`✓ Optional input ${input.name} connected to planned node`);
                continue;
            } else {
                console.log(`✗ Optional input ${input.name} connected but source not planned`);
                invalidInputs.push(input.name);
            }
        }
    }
    console.log(`Invalid inputs for ${node.data.type}:`, invalidInputs);
    return invalidInputs;
}
function getIncomers(node:AppNode,nodes:AppNode[],edges:Edge[]){
if(!node.id){
return[];
}
const incomersIds = new Set();
edges.forEach(edge=>{
    if(edge.target === node.id){
        incomersIds.add(edge.source);
    }

});
return nodes.filter((n)=>incomersIds.has(n.id));
}