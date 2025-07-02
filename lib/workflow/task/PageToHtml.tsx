import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {LucideProps, CodeIcon } from "lucide-react";

export const PageToHtmlTask ={
    type:TaskType.PAGE_TO_HTML,
    label:"Lấy HTML từ trang Web",
    icon:(props:LucideProps)=>(
        <CodeIcon  className="stroke-red-400" {...props} />
    ),
    isEntryPoint:false,
    credits:2,
    inputs:[
        {
            name:"Web page",
            type:TaskParamType.BROWSER_INSTANCE,
            require:true
        }
    ] as const,
    outputs:[
        {
            name:"Html",
            type:TaskParamType.STRING,
        },
        {
            name:"Web page",
            type:TaskParamType.BROWSER_INSTANCE
        }
    ]as const  
}satisfies WorkflowTask