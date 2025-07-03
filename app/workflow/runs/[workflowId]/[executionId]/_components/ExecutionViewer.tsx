"use client";
import { GetWorkflowExecutionWithPhase } from '@/actions/workflow/getWorkflowExecutionWithPhase';
import { getWorkflowPhaseDetails } from '@/actions/workflow/getWorkflowPhaseDetails';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { DatesToDurationString } from '@/lib/helper/dates';
import { GetPhaseTotalCost } from '@/lib/helper/phases';
import { WorkflowExecutionStatus } from '@/types/workflow';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Calendar1Icon, CircleDashedIcon, ClockIcon, CoinsIcon, Loader2Icon, LucideIcon, WorkflowIcon } from 'lucide-react';
import React, { ReactNode, useState } from 'react'
type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhase>>
export default function ExecutionViewer(
    { initialData }:
        { initialData: ExecutionData }) {
    const query = useQuery({
        queryKey: ['execution', initialData?.id],
        initialData,
        queryFn: () => GetWorkflowExecutionWithPhase(initialData!.id),
        refetchInterval: (q) => q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
    });
    const [selectedPhase, setSelectedPhase] = useState<string | null>(null)
    const phaseDetails = useQuery({
        queryKey: ["phaseDetails", selectedPhase],
        enabled: selectedPhase !== null,
        queryFn: () => getWorkflowPhaseDetails(selectedPhase!),
    })
    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING
    const duration = DatesToDurationString(
        query.data?.completedAt,
        query.data?.startedAt
    )

    const creditsConsumer = GetPhaseTotalCost(query.data?.phases || []);

    return (

        <div className='flex w-full h-full'>
            <aside className='w-[440px] min-w-[440px] max-w-[440px]
            border-r-2 border-separate flex flex-grow flex-col overflow-hidden
            '>
                {/**status at lable */}
                <ExecutionLabel icon={CircleDashedIcon} label="Trạng Thái" value={query.data?.status} />

                {/**Start at lable */}
                <ExecutionLabel
                    icon={Calendar1Icon}
                    label="Thời Gian Start"
                    value={
                        <span className='lowercase'>
                            {
                                query.data?.startedAt
                                    ? formatDistanceToNow(new Date(query.data?.startedAt), { addSuffix: true })
                                    : "-"
                            }
                        </span>
                    }
                />
                <ExecutionLabel icon={ClockIcon} label="Thời lượng" value={duration ? (
                    duration
                ) : (
                    <Loader2Icon className='animate-spin' size={20} />
                )} />
                <ExecutionLabel icon={CoinsIcon} label="Đã dùng" value={creditsConsumer} />
                <Separator />
                <div className="flex justify-center items-center py-2 px-4">
                    <div className='flex text-muted-foreground items-center gap-2'>
                        <WorkflowIcon size={20} className='stroke-muted-foreground/80' />
                        <span className='font-semibold'>Phases</span>
                    </div>
                </div>
                <Separator />
                <div className="overflow-auto h-full px-2 py-4">
                    {query.data?.phases.map((phase, index) => (
                        <Button
                            variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                            key={phase.id}
                            onClick={() => {
                                if (isRunning) return;
                                setSelectedPhase(phase.id)
                            }}
                            className='w-full  justify-between'>
                            <div className='flex items-center gap-2'>
                                <Badge variant={"outline"}>{index + 1}</Badge>
                                <p className='font-semibold'>{phase.name}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">{phase.status}</p>
                        </Button>
                    )
                    )}
                </div>
            </aside>
            <div className="flex w-full h-full">
                {isRunning && (
                    <div className="flex items-center flex-col gap-2 justify-center w-full h-full
                    ">
                        <p className="font-bold">Đang chạy, vui lòng đợi...</p>
                    </div>
                )}
                {
                    !isRunning && !selectedPhase &&(
                      <div className="flex items-center flex-col gap-2 justify-center w-full h-full
                    ">
                        <div className='flex flex-col gap-1 text-center'>
                            <p className="font-bold">Không có giai đoạn nào được chọn</p>
                            <p className="text-sm text-muted-foreground">
                                Chọn một giai đoạn để xem chi tiết
                            </p>
                        </div>
                    </div>  
                    )
                }
                {
                 !isRunning && selectedPhase && phaseDetails.data &&(
                    <div className="flex  flex-col py-4 container 
                    gap-4 overflow-auto
                    ">
                        <div className="flex  gap-2 items-center">
                        <Badge variant={"outline"} className='space-x-4'>
                        <div className="flex gap-1 items-center">
                            <CoinsIcon size={20} className='stroke-muted-foreground'/>
                            <span>Tín Dụng</span>
                        </div>
                            <span>TODO</span>
                        </Badge>
                        <Badge variant={"outline"} className='space-x-4'>
                        <div className="flex gap-1 items-center">
                            <ClockIcon size={20} className='stroke-muted-foreground'/>
                            <span>Thời lượng</span>
                        </div>
                            <span>{
                                DatesToDurationString(phaseDetails.data.completedAt,
                                    phaseDetails.data.startedAt
                                ) || "-"
                                
                                }</span>
                        </Badge>
                        </div>
                    </div>
                 )
                }
            </div>
        </div>
    )
}
function ExecutionLabel({
    icon,
    label,
    value
}: {
    icon: LucideIcon,
    label: ReactNode,
    value: ReactNode
}) {
    const Icon = icon
    return (
        <div className="flex justify-between items-center px-4 py-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground w-[150px]">
                <Icon size={20} className="stroke-muted-foreground/80" />
                <span>{label}</span>
            </div>
            <div className="font-semibold capitalize flex gap-2 items-center">
                {value}
            </div>
        </div>

    )
}
