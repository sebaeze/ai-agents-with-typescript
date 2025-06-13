import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from '@langchain/pinecone';
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { PromptTemplate } from "@langchain/core/prompts";
import { Document } from "@langchain/core/documents";
import fetch from 'node-fetch'; // Import node-fetch

import "dotenv/config";

const pineconeApiKey = process.env.PINECONE_API_KEY||"";
const pineconeIndexName = process.env.PINECONE_INDEX_NAME||"";
const ollamaModel = process.env.OLLAMA_MODEL || "llama2"; // For the LLM
const ollamaEmbeddingsModel = process.env.OLLAMA_EMBEDDINGS_MODEL || "nomic-embed-text:latest"; // For embeddings
const ollamaEmbeddingsUrl = process.env.OLLAMA_EMBEDDINGS_URL || "http://localhost:11434/api/embeddings"; // For embeddings API URL

if (!pineconeApiKey || !pineconeIndexName) {
  throw new Error("Missing Pinecone API Key or Index Name in environment variables.");
}

// Function to get embeddings from Ollama
async function getOllamaEmbeddings(text: string): Promise<number[]> {
    console.log(`Requesting Ollama embedding for text (first 50 chars): "${text.substring(0, 50)}..." with model: ${ollamaEmbeddingsModel}`);
    const response = await fetch(ollamaEmbeddingsUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: ollamaEmbeddingsModel,
            prompt: text, // Changed 'input' to 'prompt' as 'prompt' is standard for Ollama embeddings API
        }),
    });

    const responseBodyText = await response.text(); // Read body once for logging/error

    if (!response.ok) {
        console.error(`Ollama embeddings API error: ${response.status} ${response.statusText}`);
        console.error("Ollama API Response Body:", responseBodyText);
        throw new Error(`Ollama embeddings API error: ${response.status} ${response.statusText}. Body: ${responseBodyText}`);
    }

    let data;
    try {
        data = JSON.parse(responseBodyText);
    } catch (e: any) {
        console.error("Failed to parse Ollama response as JSON. Response body:", responseBodyText);
        throw new Error(`Failed to parse Ollama response as JSON. Error: ${e.message}`);
    }

    if (!data || typeof data !== 'object') {
        console.error("Ollama response data is not an object:", data);
        throw new Error("Ollama response data is not an object.");
    }

    if (data.error) {
        console.error("Ollama API returned an error in the response body:", data.error);
        throw new Error(`Ollama API error: ${data.error}`);
    }

    const embedding = data.embedding;

    if (!embedding) {
        console.error("Ollama response data does not contain 'embedding' field:", data);
        throw new Error("Ollama response data does not contain 'embedding' field.");
    }

    if (!Array.isArray(embedding)) {
        console.error(`Ollama 'embedding' field is not an array. Type: ${typeof embedding}. Value:`, embedding);
        throw new Error(`Ollama 'embedding' field is not an array. Received type: ${typeof embedding}. Check Ollama logs and model compatibility with the embeddings endpoint.`);
    }
    
    // console.log(`Successfully received embedding. Length: ${embedding.length}. Type: ${typeof embedding}. IsArray: ${Array.isArray(embedding)}`);
    return embedding as number[];
}

async function main() {
    const pinecone = new Pinecone({
        apiKey: pineconeApiKey,
    });

    console.log("...pineconeIndexName: ",pineconeIndexName,";");
    const pineconeIndex = pinecone.Index(pineconeIndexName);

    const ollamaChatModel = new ChatOllama({
        baseUrl: "http://localhost:11434", // Adjust if needed
        model: ollamaModel,
    });

    // Updated prompt template to use {input} for the user's question
    const QA_PROMPT_TEMPLATE =
        `Eres un asistente experto en programación TypeScript.
        Responde a la pregunta del usuario basándote en el siguiente contexto de código TypeScript y tu propio conocimiento.
        Si la información proporcionada en el contexto no es suficiente, informa que no tienes suficiente información específica pero intenta ofrecer una respuesta útil con tu conocimiento general.

        Contexto de código:
        {context}

        Pregunta del usuario: {input}

        Respuesta: `;
    const qaPrompt = PromptTemplate.fromTemplate(QA_PROMPT_TEMPLATE);

    const vectorStore = await PineconeStore.fromExistingIndex(
        {
            // Use the Ollama embedding function
            embedDocuments: async (texts) => {
                return Promise.all(texts.map(getOllamaEmbeddings));
            },
            embedQuery: getOllamaEmbeddings,
        },
        {
            pineconeIndex,
            namespace: "ns-markdown-docs",
            //textKey: "text",
        }
    );

    const retriever = vectorStore.asRetriever();

    // Create the document chain that will take the user's question and the retrieved documents
    // and format them into a prompt for the LLM.
    const documentChain = await createStuffDocumentsChain({
        llm: ollamaChatModel,
        prompt: qaPrompt
    });

    // Create the retrieval chain that combines the retriever and the document chain.
    const retrievalChain = await createRetrievalChain({
        retriever,
        combineDocsChain: documentChain,
    });

    console.log("¡Bienvenido! Hazme preguntas sobre código TypeScript.");
    console.log("Escribe 'salir' para terminar.");

    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.setPrompt('> ');
    readline.prompt();

    readline.on('line', async (line: string) => {
        const query = line.trim();

        if (query.toLowerCase() === 'salir') {
            readline.close();
            return;
        }

        try {
            console.log("\nProcesando tu consulta...\n");
            //
             // --- MODIFICATION START: Explicitly log Pinecone query results ---
            console.log(`Consultando Pinecone directamente con el retriever para la consulta: "${query}"`);
            // The 'retriever' is configured with your PineconeStore and embedding function.
            // Calling getRelevantDocuments will perform the similarity search in Pinecone.
            const pineconeDocs = await retriever.getRelevantDocuments(query);
            console.log(`\n\n\n\nPinecone devolvió ${pineconeDocs.length} documento(s) relevante(s):`);
            if (pineconeDocs.length > 0) {
                pineconeDocs.forEach((doc: Document, index: number) => {
                    console.log(`--- Documento Pinecone ${index + 1} ---`);
                    console.log(`Contenido (primeros 200 caracteres): ${doc.pageContent.substring(0, 200)}...`);
                    console.log(`Metadatos: ${JSON.stringify(doc.metadata)}`); // Log all metadata
                });
            }
            console.log("--- Fin de los documentos directos de Pinecone ---\n\n\n\n");
            // --- MODIFICATION END ---
            //
            // Invoke the new chain. The input is an object with the 'input' key.
            const result = await retrievalChain.invoke({ input: query });

            console.log("Respuesta:");
            console.log(result.answer); // The answer is in result.answer

            // The retrieved documents are in result.context
            if (result.context && result.context.length > 0) {
                console.log("\nDocumentos de origen relevantes:");
                result.context.forEach((doc: Document, index: number) => {
                    console.log(`--- Documento ${index + 1} ---`);
                    console.log(`Contenido: ${doc.pageContent.substring(0, 200)}...`);
                    console.log(`Fuente: ${doc.metadata.source || 'Desconocida'}`);
                });
            }

        } catch (error) {
            console.error("Ocurrió un error al procesar la consulta:", error);
        }
        readline.prompt();
    }).on('close', () => {
        console.log("¡Adiós!");
        process.exit(0);
    });
}

main().catch(console.error);