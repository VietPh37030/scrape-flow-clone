import { GetWorkflowExecutions } from "@/actions/workflow/getWorkflowExecutions";
import TopBar from "@/app/(dashboard)/workflows/_components/topbar/Topbar";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import ExecutionsTable from "./_components/ExecutionsTable";

export default function ExecutionPage({ params }: { params: { workflowId: string } }) {
    return (
        <div className="h-full w-full overflow-auto">
            <TopBar workflowId={params.workflowId}
                hiddenBtn
                title="Tất cả các lần chạy"
                subtitle="Danh sách các lần chạy của workflow này"
            />
            <Suspense fallback={
                <div
                    className="flex items-center h-full w-full justify-center"
                ><Loader2Icon className="animate-spin" size={30} /></div>
            }>
                <ExecutionsTableWrapper workflowId={params.workflowId} />
            </Suspense>
        </div>
    )
}
async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
    const executions = await GetWorkflowExecutions(workflowId)
    if (!executions) {
        return <div>Không có Data</div>
    }
    if (executions.length === 0) {
        return <div className="container w-full py-6">
            <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
                <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
                <div><InboxIcon size={40} className="stroke-primary" /></div>
            </div>
            <div>
                <p className="font-bold">
                    Không có lần chạy nào với workflow này
                </p>
                <p className=" text-sm text-muted-foreground">
                    Hãy chạy workflow này để xem các lần chạy ở đây.
                </p>
            </div>
            </div>
        </div>
    }
    return (<div className="container w-full py-6">
        <ExecutionsTable workflowId={workflowId} initialData={executions} />
    </div>
    )
}