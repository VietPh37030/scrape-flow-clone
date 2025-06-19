"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Layers2Icon } from 'lucide-react'
import CustomDialogHeader from '@/components/CustomDialogHeader'
import { useForm } from 'react-hook-form'
import { createWorkflowSchema } from '@/schema/workflow'
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
function CreateWorkflowDialog({ triggerText }: { triggerText?: string }) {
    const [open, setOpen] = useState(false)
    const form = useForm<z.infer<typeof createWorkflowSchema>>({
        resolver: zodResolver(createWorkflowSchema),
        defaultValues: {

        }
    })
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                >
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
                        <form className='space-y-8 w-full '>
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
                            >

                            </FormField>
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
                                            <Textarea  className='resize-none '{...field} />
                                        </FormControl>
                                        <FormDescription>
                                           Viết mô tả ngắn gọn về chức năng của workflow này.
                                        </FormDescription>
                                    </FormItem>
                                )}
                            >

                            </FormField>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateWorkflowDialog