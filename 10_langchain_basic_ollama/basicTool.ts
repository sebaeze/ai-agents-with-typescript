/*
*
*/
import "dotenv/config";
import { ChatOllama } from "@langchain/ollama";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { DynamicTool } from '@langchain/core/tools';
//
const helloTool = new DynamicTool({
    name: "helloTool",
    description: "test function tooling",
    func: async (parameters:string) => {
        console.log("\n\n\n....estoy en tool \n\n\n");
        return new Date().toISOString()+"__Hello__parameters: "+parameters+";";
    }
});
//
const model = new ChatOllama({
        model: process.env.OLLAMA_MODEL||"",
        baseUrl: process.env.OLLAMA_BASE_URL||"http://localhost:11434",
        verbose: true
    }) ;
//
async function main(){
    try{
        //
        const modelWithtool = model.bindTools([helloTool]);
        //
        const prompTempl = ChatPromptTemplate.fromMessages([
            ["system","You are a helpfull assistant that execute the test function tooling every time"],
            ["user","{input}"]
        ]);
        const chainPipes = prompTempl.pipe(model.bindTools([helloTool]));
        //const resu = await chainPipes.invoke({input:"test function tooling"})
        const resu = await modelWithtool.invoke("Execute the test function tooling and pass the following parameter: '_ttt_'")
        console.log(resu);
        console.log("\n\nTool calls:", resu.tool_calls![0]);
        //
    } catch(e){
        console.log("\n\n ERROR: ",e);
    }
}
//
main();
//