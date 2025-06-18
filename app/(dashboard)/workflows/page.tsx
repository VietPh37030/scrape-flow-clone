"use client"

import { Skeleton } from '@/components/ui/skeleton'
import { waitFor } from '@/lib/helper/waitFor'
import React, { Suspense } from 'react'
import {AlertDescription,Alert,AlertTitle} from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { getWorkflowsForUser } from '@/actions/workflow/getWorkflowsForUser'

function page() {
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
      </div>
      <div className="h-full py-6">
        <Suspense fallback={<UserWorkflowSkeleton />}>
          <UserWorkflows />
        </Suspense>
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

async function UserWorkflows() {
  await waitFor(3000)
  const workflows = await getWorkflowsForUser();
  if (!workflows) {
    return(
       <Alert variant={"destructive"}>
      <AlertCircle className='w-4 h-4'/>
      <AlertTitle>Error</AlertTitle>
       <AlertDescription>Something went wrong.Please try later</AlertDescription>
    </Alert>
    )
  }
  return(
    <div className="">
    </div>
  )
}

export default page