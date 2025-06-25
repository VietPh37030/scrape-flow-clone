import { TaskParamType, TaskType } from "@/types/task";
import {LucideProps, CodeIcon, TextIcon } from "lucide-react";

export const ExtractTextFromElementTask ={
    type:TaskType.EXTRACT_TEXT_FROM_ELEMENT,
    label:"Lấy Text từ Element",
    icon:(props:LucideProps)=>(
        <TextIcon className="stroke-red-400" {...props} />
    ),
    isEntryPoint:false,
    inputs:[
        {
            name:"Html",
            type:TaskParamType.STRING,
            require:true
        },
        {
            name:"Selector",
            type:TaskParamType.STRING,
            require:true
        }
    ],
    outputs:[
        {
            name:"Extracted text",
            type:TaskParamType.STRING,
        },
        
    ]  
}