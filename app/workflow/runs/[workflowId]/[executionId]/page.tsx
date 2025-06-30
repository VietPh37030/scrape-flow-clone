import TopBar from "@/app/(dashboard)/workflows/_components/topbar/Topbar"
import { ReactFlowProvider } from "@xyflow/react"


export default function ExecutionViewerPage({params}:{
    params:{
        workflowId:string,
        executionId:string
    }
}){
    return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen w-full overflow-hidden">
        <TopBar 
          workflowId={params.workflowId} 
          title="WorkFLow Chi Tiết" 
          subtitle={`RUN ID: ${params.executionId}`}
          hiddenBtn={true}
        />
      </div>
    </ReactFlowProvider>)
}