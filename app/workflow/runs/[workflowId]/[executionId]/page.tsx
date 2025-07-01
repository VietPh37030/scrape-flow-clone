import TopBar from "@/app/(dashboard)/workflows/_components/topbar/Topbar"
import { waitFor } from "@/lib/helper/waitFor"
import { ReactFlowProvider } from "@xyflow/react"
import { Loader2Icon } from "lucide-react"
import { Suspense } from "react"
import {GetWorkflowExecutionWithPhase} from "@/actions/workflow/getWorkflowExecutionWithPhase"
import ExecutionViewer from "./_components/ExecutionViewer"


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
        <section className="flex h-full overflow-auto">
        <Suspense fallback={<div className="flex w-full items-center justify-center">
          <Loader2Icon className="w-10 h-10 animate-spin stroke-primary" />
        </div>}>
          <ExecutionViewerWrapper executionId ={params.executionId}/>
        </Suspense>
        </section>
      </div>
    </ReactFlowProvider>)
}
async function ExecutionViewerWrapper({executionId}:{executionId:string}) {
  const workflowExecution = await GetWorkflowExecutionWithPhase(executionId);
  if(!workflowExecution){
    return <div>Not Found</div>
  }
  return (
   <ExecutionViewer initialData={workflowExecution} />
  )
}