"use client";
import { PublishWorkflow } from '@/actions/workflow/publishWorkflow';
import { RunWorkflow } from '@/actions/workflow/runWorkflow';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PlayIcon, SquareArrowUpIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';


export default function PublishBtn({workflowId}:{workflowId:string}) {
  const generate = useExecutionPlan();
  const{toObject} = useReactFlow();
  const mutation = useMutation({
    mutationFn:PublishWorkflow,
    onSuccess:()=>{
      toast.success("Xuất bản thành công",{id:workflowId});
    },
    onError:()=>{
      toast.error("Xuất bản thất bại",{id:workflowId});
    }

  })
  return (
    <Button
     variant={"outline"}
     disabled={mutation.isPending}
      className='flex items-center gap-2' onClick={()=>{
      const plan = generate();
     if(!plan){
      return;
     }
     toast.loading("Đang xuất bản workflow...",{id:workflowId});
     mutation.mutate({
      id:workflowId,
      flowDefinition:JSON.stringify(toObject())
     })
    }}>
        <SquareArrowUpIcon size={16} className='stroke-purple-600' />
        Xuất bản
    </Button>
  )
}
