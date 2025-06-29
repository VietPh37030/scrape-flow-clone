import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges, useReactFlow } from "@xyflow/react";
import { ReactNode } from "react";
import NodeParamField from "./NodeParamField";
import { ColorForHandle } from "./common";
import useFlowValidation from "@/components/hooks/useFlowValidation";
import { AppNode } from "@/types/appNode";

export function NodeInputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">
    {children}
  </div>
}
export function NodeInput({ input, nodeId }: { input: TaskParam, nodeId: string }) {
  const {invalidInputs} = useFlowValidation();
  const edges = useEdges();
  const { getNodes } = useReactFlow();

  const isConnected = edges.some(
    (edges) => edges.target === nodeId  && edges.targetHandle === input.name
  )

  // Real-time validation: check if this specific input has error
  const hasErrors = (() => {
    // First check if validation context has this error
    const nodeWithErrors = invalidInputs?.find((node)=>node.nodeId === nodeId);
    if (nodeWithErrors?.input.includes(input.name)) {
      return true;
    }

    // If no validation context error, do real-time check
    if (input.require && !isConnected) {
      const nodes = getNodes() as AppNode[];
      const currentNode = nodes.find(n => n.id === nodeId);
      if (currentNode) {
        const inputValue = currentNode.data.inputs[input.name];
        const hasValue = inputValue && inputValue.length > 0;
        return !hasValue; // Error if required but no value
      }
    }

    return false;
  })();
  return <div className={cn("flex justify-start relative p-3 bg-secondary w-full",
     hasErrors &&"bg-destructive/30"
  )
 }>
    <NodeParamField nodeId={nodeId} param={input} disabled={isConnected} />
    {!input.hideHandle && (
      <Handle
       id={input.name} 
       type="target" 
       position={Position.Left}
       isConnectable={!isConnected}
        className={cn("!bg-muted-foreground !border-2 !border-background absolute -left-4 !w-4 !h-4 !rounded-full"
          , ColorForHandle[input.type]
        )}
      />
    )}


  </div>
}