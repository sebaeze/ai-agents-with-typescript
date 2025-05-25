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
//
async function main() {
    const response = await ollamaModel.invoke(
        "Which is the capital of France?"
    );
    console.log(response);
};
//
main();
//