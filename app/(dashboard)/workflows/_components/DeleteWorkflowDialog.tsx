"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { AlertDialogDescription } from '@radix-ui/react-alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { toast } from 'sonner';

interface Props {
    open: boolean,
    setOpen: (open: boolean) => void,
    workflowName: string,
    workflowId: string
}

function DeleteWorkflowDialog({ open, setOpen, workflowName, workflowId }: Props) {
    const [confirmText, setConfirmText] = useState("");
    const queryClient = useQueryClient();
    
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(`/api/workflows?id=${id}`, {
                method: 'DELETE',
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Lỗi khi xóa workflow');
            }
            
            return await response.json();
        },
        onMutate: () => {
            toast.loading("Đang xóa workflow...", { id: workflowId });
        },
        onSuccess: () => {
            // Đóng dialog trước
            setOpen(false);
            setConfirmText("");
            
            // Hiển thị toast success
            toast.success("Xóa workflow thành công", { id: workflowId });
            
            // Invalidate queries để refresh data
            queryClient.invalidateQueries({ queryKey: ['workflows'] });
        },
        onError: (error) => {
            console.error('Delete workflow error:', error);
            toast.error("Xóa workflow thất bại: " + (error as Error).message, { id: workflowId });
        }
    });

    // Reset state khi dialog đóng
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setConfirmText("");
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader className='flex items-center'>
                    <AlertDialogTitle>Bạn có chắc với lựa chọn này?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Nếu bạn xóa workflow, bạn sẽ không thể khôi phục lại được.
                        <div className="flex flex-col py-4 gap-2 items-center">
                            <p className='text-sm text-muted-foreground'>
                                Nếu bạn chắc chắn, hãy nhập <b>{workflowName}</b> để xác nhận.
                            </p>
                            <Input
                                value={confirmText}
                                onChange={e => setConfirmText(e.target.value)}
                                placeholder={`Nhập "${workflowName}" để xác nhận`}
                            />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Thoát
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={confirmText !== workflowName || deleteMutation.isPending}
                        className='bg-destructive text-destructive-foreground hover:bg-red-600'
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteMutation.mutate(workflowId);
                        }}
                    >
                        {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteWorkflowDialog