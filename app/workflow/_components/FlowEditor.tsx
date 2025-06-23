import { Workflow } from '@/lib/generated/prisma'
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState } from '@xyflow/react'
import React from 'react'
import "@xyflow/react/dist/style.css"
function FlowEditor({workflow}:{workflow:Workflow}) {
    const[nodes,setNodes,onNodeChange] = useNodesState([]);
    const[edges,setEdges,onEdgesChange] = useEdgesState([]);
  return (
   <main className='w-full h-full '>
    <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgesChange}  
    >
    <Controls position='top-left'/>
    <Background variant={BackgroundVariant.Dots} gap={12}  size={1}/>
    </ReactFlow>
   </main>
  )
}

export default FlowEditor
