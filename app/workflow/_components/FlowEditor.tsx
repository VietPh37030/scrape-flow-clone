import { Workflow } from '@/lib/generated/prisma'
import { Background, BackgroundVariant, Controls, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import React, { useEffect } from 'react'
import "@xyflow/react/dist/style.css"
import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/task';
import NodeComponent from '@/app/(dashboard)/workflows/_components/nodes/NodeComponent';
import { AppNode } from '@/types/appNode';
import { set } from 'date-fns';
const nodeTypes ={
  FlowScrapeNode:NodeComponent,
}
const snapGrid:[number,number] = [50,50];
const fitViewOptions = { padding: 1 };
function FlowEditor({workflow}:{workflow:Workflow}) {
    const[nodes,setNodes,onNodeChange] = useNodesState([]);
    const[edges,setEdges,onEdgesChange] = useEdgesState([]);
    const {setViewport} = useReactFlow();
    useEffect(() => {
      try {
      const flow = JSON.parse(workflow.definition);
       if (!flow) return;
       setNodes(flow.nodes||[]);
       setEdges(flow.edges||[]);
       if(!flow.viewport) return;
       const {x=0,y=0,zoom=1} = flow.viewport;
       setViewport({x,y,zoom});
      } catch (error) {
        
      }
    }, [workflow.definition,setEdges,setNodes,setViewport]);
    
  return (
   <main className='w-full h-full '>
    <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}  
        snapToGrid
        fitViewOptions={fitViewOptions}
        snapGrid={snapGrid}
        fitView
    >
    <Controls position='top-left' fitViewOptions={fitViewOptions}/>
    <Background variant={BackgroundVariant.Dots} gap={12}  size={1}/>
    </ReactFlow>
   </main>
  )
}

export default FlowEditor
