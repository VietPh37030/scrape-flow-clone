import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import {LucideProps, CodeIcon, TextIcon, Variable } from "lucide-react";

export const ExtractTextFromElementTask ={
    type:TaskType.EXTRACT_TEXT_FROM_ELEMENT,
    label:"Lấy Text từ Element",
    icon:(props:LucideProps)=>(
        <TextIcon className="stroke-red-400" {...props} />
    ),
    isEntryPoint:false,
    credits:3,
    inputs:[
        {
            name:"Html",
            type:TaskParamType.STRING,
            require:true,
            variant:"textarea"
        },
        {
            name:"Selector",
            type:TaskParamType.STRING,
            require:true
        }
    ] as const,
    outputs:[
        {
            name:"Extracted text",
            type:TaskParamType.STRING,
        },
        
    ]as const
      
}satisfies WorkflowTask