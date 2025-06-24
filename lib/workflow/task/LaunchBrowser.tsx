import { TaskParamType, TaskType } from "@/types/task";
import { GlobeLockIcon, GlobeIcon,LucideProps } from "lucide-react";

export const LaunchBrowserTask ={
    type:TaskType.LAUNCH_BROWSER,
    label:"Launch browser",
    icon:(props:LucideProps)=>(
        <GlobeIcon  className="stroke-pink-600" {...props} />
    ),
    isEntryPoint:true ,
    inputs:[
        {
            name:"Website URL",
            type:TaskParamType.STRING,
            helperText:"eg: https://google.com",
            require:true,
            hideHandle:true
        }
    ]  
}