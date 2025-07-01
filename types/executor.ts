import { Browser } from "puppeteer";

export type Enviroment ={
    browser?:Browser;
    //Phases  with nodeId/TaskId  askey
    phases:Record<
    string,
    {
        inputs:Record<string,string>;
        outputs:Record<string,string>;
    }
    >
};