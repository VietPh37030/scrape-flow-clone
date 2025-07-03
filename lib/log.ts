import { Log, LogCollector, LogFuntion, LogLevel, LogLevels } from "@/types/log";

export function createLogCollector(): LogCollector {
    const logs: Log[] = []
    const getAll = () => logs;

    const logFuntions ={} as Record<LogLevel,LogFuntion>;
    LogLevels.forEach(level => logFuntions[level]=(message:string)=>{
        logs.push({message,level,timestamp:new Date()})
    })
    return {
        getAll,
        ...logFuntions
    }
}