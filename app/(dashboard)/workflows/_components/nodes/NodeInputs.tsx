import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import { ReactNode } from "react";
import NodeParamField from "./NodeParamField";
import { ColorForHandle } from "./common";

export function NodeInputs({ children }: { children: ReactNode }) {
  return <div className="flex flex-col divide-y gap-2">
    {children}
  </div>
}
export function NodeInput({ input, nodeId }: { input: TaskParam, nodeId: string }) {
  const edges = useEdges();
  const isConnected = edges.some(
    (edges) => edges.target === nodeId  && edges.targetHandle === input.name
  )
  return <div className="flex justify-start relative p-3 bg-secondary w-full">
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