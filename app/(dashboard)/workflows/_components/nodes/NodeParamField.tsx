"use client"
import { Input } from '@/components/ui/input'
import { TaskParam, TaskParamType } from '@/types/task'

import StringParam from './param/StringParam'
import { useReactFlow } from '@xyflow/react'
import { AppNode, AppNodeData } from '@/types/appNode'
import { useCallback } from 'react'
import BrowserInstanceParam from './param/BrowserInstanceParam'

function NodeParamField({
    param,
    nodeId,
    disabled

}: {
    param: TaskParam,
    nodeId: string,
    disabled: boolean
}) {
    const { updateNodeData, getNode } = useReactFlow();
    const node = getNode(nodeId) as AppNode;
    const value = node?.data.inputs?.[param.name];

    const updateNodeParamValue = useCallback((newValue: string) => {
        updateNodeData(nodeId, {
            inputs: {
                ...node?.data.inputs,
                [param.name]: newValue
            }
        });
    },
        [nodeId, updateNodeData, param.name, node?.data.inputs]
    )
    switch (param.type) {
        case TaskParamType.STRING:
            return (
                <StringParam
                    param={param}
                    value={value}
                    updateNodeParamValue={updateNodeParamValue}
                    disabled={disabled}
                />
            );
        case TaskParamType.BROWSER_INSTANCE:
            return (
                <BrowserInstanceParam
                    param={param}
                    value={value}
                    disabled={disabled}
                    updateNodeParamValue={updateNodeParamValue}
                />
            );
        default:
            return (
                <div className="w-full">
                    <p className="text-xs text-muted-foreground">
                        Chưa được triển khai
                    </p>
                </div>
            )
    }
}

export default NodeParamField