import { AppNodeMissingInput } from "@/types/appNode";
import { createContext, Dispatch, ReactNode, SetStateAction, useState } from "react";


type FlowValidationContextType = {
    invalidInputs : AppNodeMissingInput[];
    setInvalidInputs :Dispatch<SetStateAction<AppNodeMissingInput[]>>;
    clearErrors:()=> void;
};
export const FlowValidationContext = createContext<FlowValidationContextType|null>(null);
export function FlowValidateionContextProvider({
    children,
}:{
    children:ReactNode
}){
    const[ invalidInputs,setInvalidInputs] = useState<AppNodeMissingInput[]>(
        []
    );
    const clearErrors =()=>{
        setInvalidInputs([]);
    }
    return(
        <FlowValidationContext.Provider
        value={{
                 invalidInputs,
                setInvalidInputs,
                clearErrors

        }}
        
        >{children}</FlowValidationContext.Provider>
    )
}