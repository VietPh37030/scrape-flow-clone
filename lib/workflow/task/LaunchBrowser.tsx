import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { GlobeLockIcon, GlobeIcon,LucideProps } from "lucide-react";

export const LaunchBrowserTask ={
    type:TaskType.LAUNCH_BROWSER,
    label:"Launch browser",
    icon:(props:LucideProps)=>(
        <GlobeIcon  className="stroke-pink-600" {...props} />
    ),
    isEntryPoint:true ,
    credits:5,
    inputs:[
        {
            name:"Website URL",
            type:TaskParamType.STRING,
            helperText:"eg: https://google.com",
            require:true,
            hideHandle:true
        }
    ] as const,  
    outputs:[
        {
            name:"Web page",
            type:TaskParamType.BROWSER_INSTANCE,
        }
    ] as const,
}satisfies WorkflowTask