"use client";
import { PublishWorkflow } from '@/actions/workflow/publishWorkflow';
import { RunWorkflow } from '@/actions/workflow/runWorkflow';
import { unPublishWorkflow } from '@/actions/workflow/unPublishWorkflow';
import useExecutionPlan from '@/components/hooks/useExecutionPlan';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { useReactFlow } from '@xyflow/react';
import { PlayIcon, SquareArrowUpIcon, UnplugIcon } from 'lucide-react';
import React from 'react'
import { toast } from 'sonner';


export default function UnpublishBtn({ workflowId }: { workflowId: string }) {
  
  const mutation = useMutation({
    mutationFn: unPublishWorkflow,
    onSuccess: () => {
      toast.success("Hủy Xuất bản thành công", { id: workflowId });
    },
    onError: () => {
      toast.error(" Hủy Xuất bản thất bại", { id: workflowId });
    }

  })
  return (
    <Button
      variant={"outline"}
      disabled={mutation.isPending}
      className='flex items-center gap-2' onClick={() => {
        toast.loading("Đang hủy xuất bản workflow...", { id: workflowId });
        mutation.mutate(workflowId)
      }}>
      <UnplugIcon size={16} className='stroke-teal-700' />
         Hủy Xuất bản
    </Button>
  )
}
