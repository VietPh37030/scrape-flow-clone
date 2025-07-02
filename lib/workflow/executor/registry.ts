import { TaskType } from "@/types/task";
import { LaunchBrowserExecutor } from "./LaunchBrowserExecutor";
import { PageToHtmlExecutor } from "./PageToHtmlExecutor";
import { ExecutionEnviroment } from "@/types/executor";
import { WorkflowTask } from "@/types/workflow";
import { ExtractTextFromElementExecutor } from "./ExtractTextFromElementExecutor";


type ExecutoFn<T extends WorkflowTask> = (enviroment:ExecutionEnviroment<T>) =>Promise<boolean>;
type RegistryType  ={
    [K in TaskType]:ExecutoFn<WorkflowTask & {type:K}>
}
export const ExecutorRegistry :RegistryType ={
    LAUNCH_BROWSER:LaunchBrowserExecutor,
    PAGE_TO_HTML: PageToHtmlExecutor,
    EXTRACT_TEXT_FROM_ELEMENT:ExtractTextFromElementExecutor
}