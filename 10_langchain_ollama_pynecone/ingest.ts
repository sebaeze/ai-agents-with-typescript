import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { Document } from "@langchain/core/documents";
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';

import "dotenv/config";

const pineconeApiKey = process.env.PINECONE_API_KEY||"";
const pineconeIndexName = process.env.PINECONE_INDEX_NAME||"";
const ollamaEmbeddingsModel = process.env.OLLAMA_EMBEDDINGS_MODEL || "nomic-embed-text:latest"; // For embeddings

if (!pineconeApiKey ||  !pineconeIndexName) {
    throw new Error("Missing Pinecone environment variables.");
}

// Function to get embeddings from Ollama
async function getOllamaEmbeddings(text: string): Promise<number[]> {
    const response = await fetch("http://localhost:11434/api/embeddings", { // Adjust URL if needed
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: ollamaEmbeddingsModel,
            input: text,
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama embeddings API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding;
}


async function loadTypeScriptFiles(directoryPath: string): Promise<Document[]> {
    const documents: Document[] = [];
    const files = fs.readdirSync(directoryPath);

    for (const file of files) {
        if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            const filePath = path.join(directoryPath, file);
            const content = fs.readFileSync(filePath, 'utf-8');
            documents.push(new Document({ pageContent: content, metadata: { source: filePath } }));
        }
    }
    return documents;
}

async function ingestData() {
    const pinecone = new Pinecone({
        apiKey: pineconeApiKey,
        //environment: pineconeEnvironment,
    });

    const pineconeIndex = pinecone.Index(pineconeIndexName);

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    const rawDocs = await loadTypeScriptFiles('./your-typescript-code-directory');

    if (rawDocs.length === 0) {
        console.warn("No se encontraron archivos TypeScript en el directorio especificado.");
        return;
    }

    const docs = await textSplitter.splitDocuments(rawDocs);

    // Create embeddings for each document chunk
    const embeddings = await Promise.all(docs.map(doc => getOllamaEmbeddings(doc.pageContent)));

    // Prepare data for Pinecone
    const pineconeData = docs.map((doc, index) => ({
        id: String(index), // You might want to generate more meaningful IDs
        values: embeddings[index],
        metadata: { text: doc.pageContent, source: doc.metadata.source }, // 'text' is important for PineconeStore
    }));

    // Upsert data to Pinecone
    console.log("Ingestando documentos en Pinecone...");
    await pineconeIndex.upsert(pineconeData);
    console.log("¡Ingesta de datos completada en Pinecone!");
}

ingestData().catch(console.error);