import { waitFor } from "@/lib/helper/waitFor"
import { Enviroment } from "@/types/executor";
import { log } from "console";
import puppeteer from "puppeteer"
export async  function LaunchBrowserExecutor(enviroment:Enviroment):Promise<boolean>{
    try {
        console.log("@@ENV",JSON.stringify(enviroment,null,4));
        
       const browser = await puppeteer.launch({
        headless : false //For testing
       })
       await waitFor(3000);
       await browser.close();
       return true
    } catch (error) {
        console.error(error);
        return false
    }
}