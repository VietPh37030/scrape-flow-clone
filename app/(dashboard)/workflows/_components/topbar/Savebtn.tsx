"use client"
import { UpdateWorkflow } from '@/actions/workflow/updateWorkflow'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { useReactFlow } from '@xyflow/react'
import { CheckIcon } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

function Savebtn({workflowId}:{workflowId:string}) {
  const{toObject} = useReactFlow();
  const saveMutation = useMutation({
    mutationFn:UpdateWorkflow,
    onSuccess: () => {
        toast.success("Lưu thành công",{id:"save-workflow"});
    },
    onError: () => {
      toast.error("Lưu thất bại",{id:"save-workflow"});
    }
  })
  return (
    <Button
    disabled={saveMutation.isPending}
    variant={"outline"}
    className='flex items-center gap-2 hover:bg-primary hover:text-white'
    onClick={() => {
     const workflowDefinition = JSON.stringify(toObject())
     toast.loading("Đang lưu...",{id:"save-workflow"});
     saveMutation.mutate({
      id:workflowId,
      definition:workflowDefinition
     })
       
    }}
    >
        <CheckIcon size={16}
        className='stroke-green-600'
        />
        Lưu</Button>
  )
}

export default Savebtn