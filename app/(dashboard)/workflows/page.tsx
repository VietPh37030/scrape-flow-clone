"use client"

import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'
import { AlertDescription, Alert, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, InboxIcon } from 'lucide-react'
import CreateWorkflowDialog from './_components/CreateWorkflowDialog'
import WorkflowCard from './_components/WorkflowCard'
import { useWorkflows } from './_hooks/useWorkflows'

function Page() {
  return (
    <div className='flex-1 flex flex-col h-full'>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">
            WorkFlows
          </h1>
          <p className="text-muted-foreground">
            Quản lý WorkFlows
          </p>
        </div>
        <CreateWorkflowDialog/>
      </div>
      <div className="h-full py-6">
        <UserWorkflows />
      </div>
    </div>
  )
}

function UserWorkflowSkeleton() {
  return (
    <div className="space-y-2">
      {
        [1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className='h-32 w-full ' />
        ))
      }
    </div>
  )
}

function UserWorkflows() {
  const { data: workflows, isLoading, error } = useWorkflows();
  
  if (isLoading) {
    return <UserWorkflowSkeleton />;
  }
  
  if (error) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-lg">Lỗi</AlertTitle>
        <AlertDescription>
          Không thể tải danh sách Workflows. Vui lòng thử lại sau.
        </AlertDescription>
      </Alert>
    )
  }
  
  if (!workflows || workflows.length === 0) {
    return(
        <div className="flex flex-col gap-4 h-full 
        items-center justify-center
        ">
          <div className="rounded-full bg-accent
          w-20 h-20 flex items-center justify-center
          ">
            <InboxIcon className="stroke-primary" size={40}/>
          </div>
          <div className="flex flex-col text-center gap-1">
            <p className="font-bold">Không có WorkFlows nào được tạo</p>
            <p className="text-sm text-muted-foreground">Nhấn vào nút bên dưới để tạo luồng công việc đầu tiên của bạn.</p>
          </div>
          <CreateWorkflowDialog triggerText='Tạo WorkFlow mới'/>
        </div>
    )
  }
  
  return (
   <div className="grid grid-cols-2 gap-4">
    {workflows.map((workflow)=>(
      <WorkflowCard key={workflow.id}  workflow={workflow}/>
    ))}
   </div>
  )
}

export default Page