"use client";
import { RunWorkflow } from '@/actions/workflow/runWorkflow';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PlayIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';


export default function ExecuteBtn({workflowId}:{workflowId:string}) {
  const generate = useExecutionPlan();
  const{toObject} = useReactFlow();
  const mutation = useMutation({
    mutationFn:RunWorkflow,
    onSuccess:()=>{
      toast.success("Chạy thành công",{id:"flow-execution"});
    },
    onError:()=>{
      toast.error("Chạy thất bại",{id:"flow-execution"});
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
     mutation.mutate({
      workflowId:workflowId,
      flowDefinition:JSON.stringify(toObject())
     })
    }}>
        <PlayIcon size={16} className='stroke-orange-600' />
        Chạy
    </Button>
  )
}
