export const LogLevels =["info","error"] as const;
export type LogLevel = (typeof LogLevels)[number];
export type LogFuntion = (message:string) => void;
export type Log = {message:string; level:LogLevel[number]; timestamp:Date};
export type LogCollector = {
    getAll() : Log[];
} &{
    [K in LogLevel]: LogFuntion;
}