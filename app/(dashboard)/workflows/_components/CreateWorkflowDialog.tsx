"use client"
import React, { useCallback, useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Layers2Icon, Loader2 } from 'lucide-react'
import CustomDialogHeader from '@/components/CustomDialogHeader'
import { useForm } from 'react-hook-form'
import { createWorkflowSchema, createWorkflowSchematype } from '@/schema/workflow'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    FormDescription,

} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CreateWorkflow } from '@/actions/workflow/createWorkflow'
import { toast } from 'sonner'

function CreateWorkflowDialog({ triggerText }: { triggerText?: string }) {
    const [open, setOpen] = useState(false)
    const queryClient = useQueryClient();
    
    const form = useForm<createWorkflowSchematype>({
        resolver: zodResolver(createWorkflowSchema),
        defaultValues: {
        }
    })
    
    const { mutate, isPending } = useMutation(
        {
            mutationFn: CreateWorkflow,
            onMutate: () => {
                toast.loading("Đang tạo WorkFlow...", { id: "create-workflow" });
            },
            onSuccess: () => {
                toast.success("WorkFlow đã tạo thành công", { id: "create-workflow" });
                setOpen(false);
                form.reset();
                // Invalidate và làm mới dữ liệu
                queryClient.invalidateQueries({
                    queryKey: ['workflows']
                });
            },
            onError: (error) => {
                toast.error(`Tạo Workflow thất bại: ${(error as Error).message}`, { id: "create-workflow" });
            }
        }
    )
    
    const onSubmit = useCallback((value: createWorkflowSchematype) => {
        mutate(value);
    }, [mutate])
    
    return (
        <Dialog open={open} onOpenChange={(open)=>{
            form.reset();
            setOpen(open)
        }}>
            <DialogTrigger asChild>
                <Button>
                    {triggerText ?? "Tạo Workflow"}
                </Button>
            </DialogTrigger>
            <DialogContent
                className='px-0'
            >
                <CustomDialogHeader
                    icon={Layers2Icon}
                    title="Tạo Workflow"
                    subTitle="Tạo một Workflow mới để bắt đầu quản lý công việc của bạn."
                />
                <div className="p-6">
                    <Form {...form}>
                        <form className='space-y-8 w-full'
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex gap-1 items-center'>
                                            Name
                                            <p className="text-xs text-primary">
                                                (required)
                                            </p>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Đặt tên rõ ràng, dễ hiểu và không trùng lặp.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='description'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='flex gap-1 items-center'>
                                            Description
                                            <p className="text-xs text-muted-foreground">
                                                (optional)
                                            </p>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea className='resize-none '{...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Viết mô tả ngắn gọn về chức năng của workflow này.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            />
                            <Button
                                className='w-full'
                                type='submit'
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className='animate-spin w-4 h-4 mr-2' />
                                        Đang tạo...
                                    </>
                                ) : (
                                    "Tiếp tục"
                                )}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateWorkflowDialog