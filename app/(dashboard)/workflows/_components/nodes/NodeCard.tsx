"use client"
import useFlowValidation from '@/components/hooks/useFlowValidation'
import { cn } from '@/lib/utils'
import { useReactFlow } from '@xyflow/react'
import React, { ReactNode } from 'react'

function NodeCard({children,nodeId,isSelected}:{
    children:ReactNode,
    nodeId:string,
    isSelected:boolean
}) {
    const {getNode,setCenter} = useReactFlow();
    const {invalidInputs} = useFlowValidation();
    const hasInvalidInputs = invalidInputs ? invalidInputs.some((node)=>node.nodeId === nodeId) : false;
  return (
    <div 
    onDoubleClick={()=>{
        const node = getNode(nodeId);
        if (!node) return; 
        const {position,measured} = node;
        if (!position || !measured ) return;
        const {width,height} = measured;
        const x = position.x +width!/2;
        const y = position.y +height!/2;
        if(x === undefined||y=== undefined) return;
        setCenter(x,y,{
            zoom:1,
            duration:500
        })
        
    }}
    className={cn("flex flex-col cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 rounded-md",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2"
    )}
    >{children}</div>
  )
}

export default NodeCard