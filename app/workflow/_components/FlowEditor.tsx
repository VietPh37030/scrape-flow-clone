import { Workflow } from '@/lib/generated/prisma'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import React, { useCallback, useEffect } from 'react'
import "@xyflow/react/dist/style.css"
import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/task';
import NodeComponent from '@/app/(dashboard)/workflows/_components/nodes/NodeComponent';
import { AppNode } from '@/types/appNode';
import { set } from 'date-fns';
import DeletableEdges from '@/app/(dashboard)/workflows/_components/edges/DeletableEdges';
const nodeTypes = {
  FlowScrapeNode: NodeComponent,
}
const edgesTypes = {
  default: DeletableEdges,
}
const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };
function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodeChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport,screenToFlowPosition } = useReactFlow();
  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);
      if (!flow) return;
      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom });
    } catch (error) {

    }
  }, [workflow.definition, setEdges, setNodes, setViewport]);
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);
  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const taskType = event.dataTransfer.getData("application/reactflow");
    if (typeof taskType == undefined || !taskType) return;
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY
    })

    const newNode = CreateFlowNode(taskType as TaskType, position);
    setNodes((nds) => nds.concat(newNode))
  }, []);

const onConnect = useCallback((connecttion:Connection)=>{
  console.log("@ON CONNECT",connecttion);
    setEdges((eds) =>addEdge({...connecttion},eds) )
},[])

  return (
    <main className='w-full h-full '>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodeChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgesTypes}
        snapToGrid
        fitViewOptions={fitViewOptions}
        snapGrid={snapGrid}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
      >
        <Controls position='top-left' fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor
