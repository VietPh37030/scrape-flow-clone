import { TaskParamType, TaskType } from "@/types/task";
import {LucideProps, CodeIcon } from "lucide-react";

export const PageToHtmlTask ={
    type:TaskType.PAGE_TO_HTML,
    label:"Lấy HTML từ một trang web",
    icon:(props:LucideProps)=>(
        <CodeIcon  className="stroke-red-400" {...props} />
    ),
    isEntryPoint:false,
    inputs:[
        {
            name:"Web page",
            type:TaskParamType.BROWSER_INSTANCE,
            require:true
        }
    ],
    outputs:[
        {
            name:"Html",
            type:TaskParamType.STRING,
        },
        {
            name:"Web page",
            type:TaskParamType.BROWSER_INSTANCE
        }
    ]  
}