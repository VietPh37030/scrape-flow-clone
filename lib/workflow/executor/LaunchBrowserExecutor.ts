import { waitFor } from "@/lib/helper/waitFor"
import { Enviroment, ExecutionEnviroment } from "@/types/executor";
import { log } from "console";
import puppeteer from "puppeteer"
import { LaunchBrowserTask } from "../task/LaunchBrowser";
export async  function LaunchBrowserExecutor(
    enviroment:ExecutionEnviroment<typeof LaunchBrowserTask>):Promise<boolean>{
    try {
        const webisterUrl = enviroment.getInput("Website URL"); 
        console.log("@@WEBSITE URL",webisterUrl);
       const browser = await puppeteer.launch({
        headless : true //For testing
       });
        enviroment.log.info("Trình duyệt khởi chạy thành công");
       enviroment.setBrowser(browser);
       const page =  await browser. newPage();
       await page.goto(webisterUrl)
        enviroment.setPage(page);
       enviroment.log.info(`Mở trang web với: ${webisterUrl}`);
       return true
    } catch (error:any) {
       enviroment.log.error(error.message);
        return false
    }
}