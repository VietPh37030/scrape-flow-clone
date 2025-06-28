import { FlowExecutionPlan, FlowToExecutionPlanValidationError } from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import useFlowValidation from "./useFlowValidation";
import { toast } from "sonner";

const useExecutionPlan = ()=>{
    const{toObject} =useReactFlow();
    const {setInvalidInputs,clearErrors} = useFlowValidation();
    const handleError = useCallback((error:any)=>{
            switch(error.type){
                case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
                toast.error("No entry point found");
                break;
                case FlowToExecutionPlanValidationError.INVALID_INPUTS:
                    toast.error("Thiếu một số giá trị đầu vào ");
                    setInvalidInputs(error.invalidInputs)
                    break;
                default:
                    toast.error("something wnet wrong")
                    break    
            }
    },[setInvalidInputs])
    const generateexecutionPlan = useCallback(()=>{
        const {nodes,edges} = toObject();
        const {executionPlan,error} = FlowExecutionPlan(nodes as AppNode[],edges);
        if (error) {
            handleError(error)
            return null
        }
        clearErrors()
        return executionPlan;
    },[toObject,handleError,clearErrors]);
    return generateexecutionPlan;
} 
export default useExecutionPlan;