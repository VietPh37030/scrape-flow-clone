"use client";
import { GetWorkflowExecutionWithPhase } from '@/actions/workflow/getWorkflowExecutionWithPhase';
import { getWorkflowPhaseDetails } from '@/actions/workflow/getWorkflowPhaseDetails';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ExecutionLog } from '@/lib/generated/prisma';
import { DatesToDurationString } from '@/lib/helper/dates';
import { GetPhaseTotalCost } from '@/lib/helper/phases';
import { cn } from '@/lib/utils';
import { LogLevel, LogLevels } from '@/types/log';
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from '@/types/workflow';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Calendar1Icon, CircleDashedIcon, ClockIcon, CoinsIcon, Loader2Icon, LucideIcon, WorkflowIcon } from 'lucide-react';
import React, { ReactNode, useEffect, useState } from 'react'
import PhaseStatusBadge from './PhaseStatusBadge';
import ReactCountUpWrapper from '@/components/ReactCountUpWrapper';
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
    useEffect(() => {
      // While runiing we auto-select  the current running phase in the sidebar
      const phases = query.data?.phases || [];
        if(isRunning){
            const phaseToSelect= phases.toSorted((a,b)=>
            a.startedAt! > b.startedAt! ? -1 :1
            )[0];
            setSelectedPhase(phaseToSelect.id);
            return;
        }
         const phaseToSelect= phases.toSorted((a,b)=>
            a.completed! > b.completed! ? -1 :1
            )[0];
       setSelectedPhase(phaseToSelect.id);
    }, [query.data?.phases,isRunning,setSelectedPhase])
    
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
                <ExecutionLabel icon={CircleDashedIcon}
                 label="Trạng Thái" value={<div className='capitalize font-semibold flex gap-2 items-center'>
                    <PhaseStatusBadge status={query.data?.status as ExecutionPhaseStatus} />
                    <span className='capitalize'>{query.data?.status}</span>
                 </div>} />

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
                <ExecutionLabel icon={CoinsIcon} label="Đã dùng" value={<ReactCountUpWrapper value={creditsConsumer}/>} />
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
                           <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus}/>
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
                    !isRunning && !selectedPhase && (
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
                    !isRunning && selectedPhase && phaseDetails.data && (
                        <div className="flex  flex-col py-4 container 
                    gap-4 overflow-auto
                    ">
                            <div className="flex  gap-2 items-center">
                                <Badge variant={"outline"} className='space-x-4'>
                                    <div className="flex gap-1 items-center">
                                        <CoinsIcon size={20} className='stroke-muted-foreground' />
                                        <span>Tín Dụng</span>
                                    </div>
                                    <span>{phaseDetails.data.creditsConsumed}</span>
                                </Badge>
                                <Badge variant={"outline"} className='space-x-4'>
                                    <div className="flex gap-1 items-center">
                                        <ClockIcon size={20} className='stroke-muted-foreground' />
                                        <span>Thời lượng</span>
                                    </div>
                                    <span>{
                                        DatesToDurationString(phaseDetails.data.completed,
                                            phaseDetails.data.startedAt
                                        ) || "-"

                                    }</span>
                                </Badge>
                            </div>
                            <ParamaterViewer
                                title="Đầu Vào"
                                subtitle="Các tham số đầu vào của giai đoạn này"
                                paramsJson={phaseDetails.data.inputs}
                            ></ParamaterViewer>
                            <ParamaterViewer
                                title="Đầu Ra"
                                subtitle="Các tham số đầu ra của giai đoạn này"
                                paramsJson={phaseDetails.data.outputs}
                            ></ParamaterViewer>
                            <LogViewer logs={phaseDetails.data.logs} />
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
function ParamaterViewer({ title, subtitle, paramsJson }:
    {
        title: string,
        subtitle: string,
        paramsJson: string | null,
    }
) {
    const params = paramsJson ? JSON.parse(paramsJson) : undefined;
    return (
        <Card>
            <CardHeader className=' rounded-lg rounded-b-none border-b
            py-4 bg-gray-50 dark:bg-background
            '>
                <CardTitle className='text-base'>{title}</CardTitle>
                <CardDescription className='text-muted-foreground text-sm'>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent className='py-4 '>
                <div className="flex flex-col gap-2">
                    {(!params || Object.keys(params).length === 0) && (
                        <p className='text-sm'>
                            Không có tham số nào được cung cấp cho giai đoạn này.
                        </p>
                    )}
                    {
                        params && Object.entries(params).map(([key, value]) => (
                            <div key={key} className="flex justify-between
                      items-center space-y-1
                      ">
                                <p className="text-muted-foreground text-sm flex-1 basis-1/3">
                                    {key}
                                </p>
                                <Input className='flex basis-2/3'
                                    readOnly
                                    value={value as string}
                                />
                            </div>
                        ))
                    }
                </div>
            </CardContent>
        </Card>
    )
}
function LogViewer({ logs }: { logs: ExecutionLog[] | undefined }) {
    if (!logs || logs.length === 0) return null;
    return (
        <Card className='w-full'>
            <CardHeader className='rounded-lg rounded-b-none border-b
          py-4 bg-gray-50  dark:bg-background
        '>
                <CardTitle className='text-base'>lOGS</CardTitle>
                <CardDescription className='text-muted-foreground text-sm'>
                    Các log của giai đoạn này
                </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <Table>
                    <TableHeader className='text-muted-foreground text-sm'>
                        <TableRow>
                            <TableHead>Thời gian</TableHead>
                            <TableHead>Cấp độ</TableHead>
                            <TableHead>Tin nhắn</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className='text-muted-foreground'>
                                <TableCell width={190} className='text-muted-foreground
                                text-xs p-[2px] pl-4
                                '>{log.timestamp.toISOString()}</TableCell>
                                <TableCell width={80} className={cn("uppercase text-xs font-bold p-[3px] pl-4",
                                    (log.logLevel as LogLevel) === "error" && "text-destructive",
                                    (log.logLevel as LogLevel) === "info" && "text-primary",
                                )}
                                
                                >{log.logLevel}</TableCell>
                                <TableCell className='flex-1 px-[3px] pl-4 text-sm'>{log.message}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}