/*
*
*/
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import path from "node:path";
import "dotenv/config";
//
async function main() {
    //
    const fullPath = path.join(__dirname, "../test_data/mcp.pdf");
    console.log("\n\n fullPath: ",fullPath,"*\n\n");
    //
    const loader = new PDFLoader(fullPath,{ splitPages: false });
    const docs = await loader.load();   
    //
    const splitter = new RecursiveCharacterTextSplitter({ 
        //separators:[":\n"],
         chunkSize: 1500,
        chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments(docs);
    //const rawDocuments = await splitter.createDocuments(docs);
    console.log("\n\n chunks: ",chunks,"*\n\n");
    //
    /* const embeddings = new OllamaEmbeddings({
        model: process.env.OLLAMA_EMBEDDINGS_MODEL||"nomic-embed-text",
        baseUrl: process.env.OLLAMA_EMBEDDINGS_URL||"http://localhost:11434",
    }); */
    //
    const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" });
    //
    const CHROMA_HOST = (process.env.CHROMA_URL||"localhost:8000").trim();
    console.log("\n\n CHROMA_HOST: ",CHROMA_HOST,"\n\n");
    const vectorStore = new Chroma(embeddings, {
        collectionName: "mcp33",
        url: CHROMA_HOST
    });
    //
    const resp = await vectorStore.addDocuments(chunks);
    console.log("\n\n resp: ",resp);
    //
}
//
main();
//