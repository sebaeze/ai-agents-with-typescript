/*
*
*/
import { ChatOllama } from "@langchain/ollama";
import "dotenv/config";
//
const ollamaModel = new ChatOllama({
    baseUrl: process.env.OLLAMA_BASE_URL||"http://localhost:11434",
    model: process.env.MOLLAMA_MODEL||"orieg/gemma3-tools:1b",
    verbose: true
});
/*
*  3 ways to call the AI Model in Ollama: invoke, batch, stream
*/
async function main() {
    const respInvoke = await ollamaModel.invoke( "Which is the capital of France?" );
    console.log("\nrespInvoke: ",respInvoke,"\n\n");

    const respBatch = await ollamaModel.batch( ["Which is the capital of France?", "Describe the capital of France"] );
    console.log("respBatch: ",respBatch,"\n\n");

    const respStream = await ollamaModel.stream( "Which is the capital of France?" );
    for await ( const chunk of respStream ){
        console.log("chunk: ",chunk);
    }
};
//
main();
//