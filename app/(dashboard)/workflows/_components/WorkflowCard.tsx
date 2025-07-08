"use client"
import { Workflow } from '@/lib/generated/prisma'
import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { WorkflowStatus } from '@/types/workflow'
import { FileTextIcon, MoreVerticalIcon, NotepadTextDashedIcon, PlayIcon, RssIcon, ShuffleIcon, TrashIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import TooltipWrapper from '@/components/TooltipWrapper'
import DeleteWorkflowDialog from './DeleteWorkflowDialog'
import RunBtn from './RunBtn'
const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-lime-400 text-black",
  [WorkflowStatus.PUBLISHED]: "bg-emerald-600 text-white"
}
function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT
  return (
    <Card className='border border-separate shadow-sm rounded-lg overflow-hidden
   hover:shadow-md dark:shadow-primary/35 
   '>
      <CardContent className='p-4 flex items-center justify-between h-[100px]'>
        <div className="flex items-center justify-end space-x-4">
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", statusColors[workflow.status as WorkflowStatus])}>
            {
              isDraft ? (
                <NotepadTextDashedIcon className='h-5 w-5' />
              ) : (
                <RssIcon className='h-5 w-5' />
              )
            }
          </div>
          {/* Nội dung */}
          <div className="flex flex-col min-w-0"> {/* min-w-0 để truncate hoạt động */}
            <h3 className="text-base font-bold text-muted-foreground flex items-center gap-2">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="truncate max-w-[180px] hover:underline"
                title={workflow.name} // Tooltip khi hover
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap">
                  DRAFT
                </span>
              )}
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isDraft && <RunBtn workflowId ={workflow.id}/>}
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(buttonVariants({
              variant: "outline",
              size: 'sm'
            }))}
          >
            <ShuffleIcon size={16} />
            Edit
          </Link>
          <WorkflowAction workflowName={workflow.name}
          workflowId={workflow.id}
          />
        </div>
      </CardContent>
    </Card>
  )
}
function WorkflowAction({workflowName,workflowId}:{workflowName: string,workflowId:string}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  return (
   <>
   <DeleteWorkflowDialog 
   open={showDeleteDialog} 
   setOpen={setShowDeleteDialog}
   workflowName={workflowName}
   workflowId={workflowId}
   />
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"sm"}>

          <TooltipWrapper content={"Thêm Actions"}>
            <div className="flex items-center justify-center w-full h-full">
              <MoreVerticalIcon size={18} />
            </div>
          </TooltipWrapper>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem className='text-destructive flex items-center gap-2'
        onSelect={()=>{
          setShowDeleteDialog((prev)=>!prev)
        }}
        >
        <TrashIcon size={16} />
        Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  
   </>
  )
}
export default WorkflowCard