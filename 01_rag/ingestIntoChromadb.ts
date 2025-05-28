/*
*
*/
import "dotenv/config"; // Moved to the top for convention
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/ollama";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import path from "node:path";
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
        separators:[":\n"],
        chunkSize: 1500,
        chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments(docs);

    // Filter out chunks with empty pageContent
    const validChunks = chunks.filter(chunk => chunk.pageContent && chunk.pageContent.trim() !== "");

    if (chunks.length !== validChunks.length) {
        console.log(`\n\nFiltered out ${chunks.length - validChunks.length} chunks with empty pageContent.\n\n`);
    }

    if (validChunks.length === 0) {
        console.log("\n\nNo valid chunks to process. Exiting.\n\n");
        return;
    }
    // Sanitize metadata for ChromaDB compatibility
    const sanitizedChunks = validChunks.map(doc => {
        const newMetadata:any = {};
        if (doc.metadata) {
            for (const key in doc.metadata) {
                const value = doc.metadata[key];
                if (value === null || typeof value === 'undefined') {
                    continue; // Skip null or undefined metadata values
                }
                if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                    newMetadata[key] = value;
                } else if (key === 'loc' && typeof value === 'object' && value !== null) {
                    // Attempt to flatten 'loc' if its properties are primitive
                    for (const locKey in value) {
                        const locValue = value[locKey];
                        if (locValue === null || typeof locValue === 'undefined') continue;
                        if (typeof locValue === 'string' || typeof locValue === 'number' || typeof locValue === 'boolean') {
                            newMetadata[`${key}_${locKey}`] = locValue;
                        } else {
                            // If a sub-property of loc is complex, stringify it
                            newMetadata[`${key}_${locKey}`] = JSON.stringify(locValue);
                        }
                    }
                } else if (typeof value === 'object' && value !== null) {
                    // For other objects, stringify the entire object
                    newMetadata[key] = JSON.stringify(value);
                } else {
                    // For any other types, convert to string
                    newMetadata[key] = String(value);
                }
            }
        }
        return {
            pageContent: doc.pageContent,
            metadata: newMetadata,
        };
    });
    //
    const embeddings = new OllamaEmbeddings({ model: "nomic-embed-text" });
    //
    let chromaHostUrl = (process.env.CHROMA_URL || "http://localhost:8000").trim();
    if (!chromaHostUrl.startsWith("http://") && !chromaHostUrl.startsWith("https://")) {
        chromaHostUrl = "http://" + chromaHostUrl;
    }
    console.log("\n\n CHROMA_HOST URL: ", chromaHostUrl, "\n\n");
    const vectorStore = new Chroma(embeddings, {
        collectionName: "collection_mcp",
        url: chromaHostUrl
    });
    //
    const resp = await vectorStore.addDocuments(sanitizedChunks);
    console.log("\n\n resp: ",resp);
    //
}
//
main();
//