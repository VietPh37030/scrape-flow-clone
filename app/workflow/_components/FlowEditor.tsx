import { Workflow } from '@/lib/generated/prisma'
import { addEdge, Background, BackgroundVariant, Connection, Controls, Edge, getOutgoers, ReactFlow, useEdgesState, useNodesState, useReactFlow } from '@xyflow/react'
import React, { useCallback, useEffect } from 'react'
import "@xyflow/react/dist/style.css"
import { CreateFlowNode } from '@/lib/workflow/createFlowNode';
import { TaskType } from '@/types/task';
import NodeComponent from '@/app/(dashboard)/workflows/_components/nodes/NodeComponent';
import { AppNode } from '@/types/appNode';
  import DeletableEdges from '@/app/(dashboard)/workflows/_components/edges/DeletableEdges';
import { TaskRegistry } from '@/lib/workflow/task/registry';
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
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();
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
  }, [screenToFlowPosition, setNodes]);

  const onConnect = useCallback((connecttion: Connection) => {
    console.log("@ON CONNECT", connecttion);
    setEdges((eds) => addEdge({ ...connecttion, animated: true }, eds));
    if (!connecttion.targetHandle) return;
    //Remove input value if is present on connection
    const node = nodes.find((nd) => nd.id === connecttion.target);
    if (!node) return;
    console.log("@FOUND NODE", node);
    const nodeInputs = node.data.inputs;
    console.log("@NODE INPUTS BEFORE", nodeInputs);
    updateNodeData(node.id, {
      inputs: {
        ...nodeInputs,
        [connecttion.targetHandle]: "",
      }
    });
    console.log("@UPDATE NODES", node.id, "TARGET HANDLE:", connecttion.targetHandle);

  }, [setEdges, updateNodeData, nodes])
  console.log("@NODES", nodes);
  const isValidConnection = useCallback((connection: Edge | Connection) => {
    // No self-connection allowed
    if (connection.source === connection.target) {
      return false
    }
    // Same taskParam type connection
    const source = nodes.find((node) => node.id === connection.source)
    const target = nodes.find((node) => node.id === connection.target)
    if (!source || !target) {
      console.log("invalid connection:source or target node not found");
      return false;
    }
    const sourceTask = TaskRegistry[source.data.type];
    const targetTask = TaskRegistry[target.data.type];
    const output = sourceTask.outputs.find((o) => o.name === connection.sourceHandle)
    const input = targetTask.inputs.find((i) => i.name === connection.targetHandle)
    console.log("@DEBUG", { input, output });
    if (input?.type !== output?.type) {
      console.log("invalid connection:type mismatch");

      return false
    }
  const hasCycle = (node:AppNode,visited =new Set())=>{
        if (visited.has(node.id)) return false;
        visited.add(node.id)
        for(const outgoer of getOutgoers(node,nodes,edges)){
          if(outgoer.id === connection.source) return true;
          if(hasCycle(outgoer,visited)) return true;
        }
  };
  const detectedCycle = hasCycle(target)
  return !detectedCycle
  }, [nodes,edges])
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
        isValidConnection={isValidConnection}
      >
        <Controls position='top-left' fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  )
}

export default FlowEditor
