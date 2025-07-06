import { cn } from '@/lib/utils'
import { WorkflowExecutionStatus } from '@/types/workflow'
import React from 'react'
const indicatorColor:Record<WorkflowExecutionStatus,string> = {
  PENDING: 'bg-slate-500',
  COMPLETED: 'bg-green-500',
  FAILED: 'bg-red-500',
  RUNNING: 'bg-orange-500',
}
export default function ExecutionStatusIndicator({status}: {status: WorkflowExecutionStatus}) {
  return (
    <div className={cn('w-2 h-2 rounded-full',indicatorColor[status])}/>
  )
}
