"use client";

import { GetWorkflowExecutions } from "@/actions/workflow/getWorkflowExecutions";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DatesToDurationString } from "@/lib/helper/dates";
import { useQuery } from "@tanstack/react-query";
import ExecutionStatusIndicator from "./ExecutionStatusIndicator";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { CoinsIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { format, toZonedTime } from 'date-fns-tz'
import { vi } from 'date-fns/locale'

type InitialDataType = Awaited<ReturnType<typeof GetWorkflowExecutions>>;

export default function ExecutionsTable(
    { workflowId, initialData }:
        { workflowId: string, initialData: InitialDataType }) {
    
    const router = useRouter();
    const query = useQuery({
        queryKey: ["executions", workflowId],
        initialData,
        queryFn: () => GetWorkflowExecutions(workflowId),
        refetchInterval: 5000
    })

    return (
        <div className="border rounded-lg shadow-md overflow-auto">
            <Table className="h-full">
                <TableHeader className="bg-muted">
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Chi tiêu</TableHead>
                        <TableHead className="text-right text-xs text-muted-foreground">
                            Bắt đầu (desc)
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="gap-2 h-full overflow-auto">
                    {query.data.map((execution) => {
                        const duration = DatesToDurationString(
                            execution.completedAt,
                            execution.startedAt
                        );

                        let fomarttedStartedAt = "";
                        let formattedDateTime = "";

                        if (execution.startedAt) {
                            const startedAtDate = new Date(execution.startedAt);
                            const vnTime = toZonedTime(startedAtDate, 'Asia/Ho_Chi_Minh');
                            fomarttedStartedAt = formatDistanceToNow(vnTime, {
                                addSuffix: true,
                                locale: vi
                            });
                            formattedDateTime = format(vnTime, 'dd/MM/yyyy HH:mm:ss');
                        }

                        return (
                            <TableRow key={execution.id} className="cursor-pointer"
                                onClick={() => {
                                    router.push(`/workflow/runs/${execution.workflowId}/${execution.id}`)
                                }}
                            >
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">
                                            {execution.id}
                                        </span>
                                        <div className="text-muted-foreground text-xs">
                                            <span>Kích hoạt:</span>
                                            <Badge variant={"outline"}>
                                                {execution.trigger}
                                            </Badge>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="flex gap-2 items-center">
                                            <ExecutionStatusIndicator
                                                status={execution.status as WorkflowExecutionStatus} />
                                            <span className="font-semibold capitalize">{execution.status}</span>
                                        </div>
                                        <div className="text-muted-foreground text-xs mx-5">
                                            {duration}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <div className="flex gap-2 items-center">
                                            <CoinsIcon className="text-primary" size={16} />
                                            <span className="font-semibold capitalize">
                                                {execution.creditsConsumed}
                                            </span>
                                        </div>
                                        <div className="text-muted-foreground text-xs mx-5">
                                            Tín dụng
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="text-xs text-muted-foreground">
                                        {formattedDateTime} • {fomarttedStartedAt}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}
