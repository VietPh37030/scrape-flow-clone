import { waitFor } from "@/lib/helper/waitFor"
import { Enviroment, ExecutionEnviroment } from "@/types/executor";
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";
import { error } from "console";
export async  function ExtractTextFromElementExecutor(
    enviroment:ExecutionEnviroment<typeof ExtractTextFromElementTask>):Promise<boolean>{
    try {
        const selector = enviroment.getInput("Selector");
        if(!selector){
            console.error("Selector not defined ");
            return false
        }
        const html = enviroment.getInput("Html");
        if(!html){
            console.error("Html not defined");
            return false
        }
         const $ = cheerio.load(html);
         const element = $(selector);
         if(!element){
            console.error("Element not found");
            return false
         }
         const extractedText = $.text(element);
         if(!extractedText){
            console.error("Element has no text")
            return false;
         }
         enviroment.setOutput("Extracted text",extractedText)
       return true
    } catch (error) {
        console.error(error);
        return false
    }
}