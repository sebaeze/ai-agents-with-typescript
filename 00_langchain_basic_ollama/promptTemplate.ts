/*
*
*/
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import { JsonOutputParser, StringOutputParser} from "@langchain/core/output_parsers";
import "dotenv/config";
//
const model = new ChatOllama({
        model: process.env.OLLAMA_MODEL||"",
        baseUrl: process.env.OLLAMA_BASE_URL||"http://localhost:11434",
        verbose: false
    }) ;
//
async function main() {
    //
    const template = ChatPromptTemplate.fromTemplate(`Which is the capital of {country}?`);
    const chain = template.pipe(model).pipe( new StringOutputParser() ) ;
    //
    const respArgentina = await chain.invoke({country: "Argentina"});
    const respFrance = await chain.invoke({country: "France"});
    const respBrasil = await chain.invoke({country: "Brasil"});
    //
    console.log(respArgentina);
    console.log(respFrance);
    console.log(respBrasil);
    //
    const promptTemplateExamples = ChatPromptTemplate.fromMessages([
        ["system","You are a helpfull AI assistant expert in capitals of countries. Your response should be in json format."],
        ["human","Which is the capital of {country}?"]
    ]) ;
    const chainSystem = promptTemplateExamples.pipe(model).pipe( new JsonOutputParser() ) ;
    const respSys = await chainSystem.invoke({country: "Uruguay"});
    console.log("\n\n ****respSys: ",respSys);
    //
};
//
main();
//