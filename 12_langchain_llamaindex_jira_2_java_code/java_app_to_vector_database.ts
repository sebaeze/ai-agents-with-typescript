/*
*
*/
import { Settings } from 'llamaindex';
import {
  VectorStoreIndex,
  storageContextFromDefaults,
  Document,
} from "llamaindex";
import { ChromaClient } from "chromadb";
import { ChromaVectorStore } from "@llamaindex/chroma";
import { OllamaEmbedding, Ollama } from "@llamaindex/ollama";
import * as path from "node:path"; // Use node: prefix for built-in modules
import * as fs from "fs";
import 'dotenv/config'; // Loads environment variables from a .env file

// --- Configuration ---
// The directory where your Java source code files are located.
// Ensure this directory exists and contains .java files.
const DATA_DIR = "./java_code";

// The name of the collection in ChromaDB where embeddings will be stored.
const CHROMA_COLLECTION_NAME = "java_code_embeddings";

// The address of your running ChromaDB instance.
// If running via Docker, it's typically http://localhost:8000.
const CHROMA_HOST = "http://localhost:8000";

// Ollama specific configuration
// The URL for your running Ollama instance (default is http://localhost:11434)
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
// The Ollama embedding model to use (e.g., 'nomic-embed-text:latest')
const OLLAMA_EMBEDDINGS_MODEL = process.env.OLLAMA_EMBEDDINGS_MODEL || "nomic-embed-text:latest";
// The Ollama LLM model to use for querying (e.g., 'orieg/gemma3-tools:1b')
const OLLAMA_LLM_MODEL = process.env.OLLAMA_MODEL || "orieg/gemma3-tools:1b";

// Configure LlamaIndex ServiceContext
// This defines the embedding model and optionally the LLM for querying.
// Using OllamaEmbedding with the specified model from environment variables.
Settings.embedModel = new OllamaEmbedding({
  model: OLLAMA_EMBEDDINGS_MODEL,
  config: { host: process.env.OLLAMA_BASE_URL }
});
Settings.llm = new Ollama({
  model: OLLAMA_LLM_MODEL,
  config: { host: OLLAMA_BASE_URL }
});
console.log("\nLlamaIndex Settings.embedModel initialized with the Ollama embedding model.");

// --- Main Indexing Function ---
async function main() {
  console.log("Starting LlamaIndex Java Code Indexing process...");
  console.log(`Source directory: ${DATA_DIR}`);
  console.log(`ChromaDB host: ${CHROMA_HOST}`);
  console.log(`ChromaDB collection: ${CHROMA_COLLECTION_NAME}`);
  console.log(`Ollama Base URL: ${OLLAMA_BASE_URL}`);
  console.log(`Ollama Embedding Model: ${OLLAMA_EMBEDDINGS_MODEL}`);
  console.log(`Ollama LLM Model: ${OLLAMA_LLM_MODEL}`);


  // 1. Verify the data directory exists
  if (!fs.existsSync(DATA_DIR)) {
    console.error(`\nError: The specified data directory '${DATA_DIR}' does not exist.`);
    console.error("Please create this directory and place your .java files inside it, or update DATA_DIR.");
    return;
  }

  // 2. Initialize ChromaDB client and get/create the collection
  console.log("\nAttempting to connect to ChromaDB and retrieve collection...");
  let client: ChromaClient;
  let collection;
  try {
    client = new ChromaClient({ path: CHROMA_HOST });
    collection = await client.getOrCreateCollection({ name: CHROMA_COLLECTION_NAME });
    console.log(`Successfully connected to ChromaDB. Collection '${CHROMA_COLLECTION_NAME}' is ready.`);
  } catch (error) {
    console.error("\nError connecting to or interacting with ChromaDB:", error);
    console.error("Please ensure your ChromaDB instance is running at the specified CHROMA_HOST.");
    console.error("You can usually start it with: 'docker run -p 8000:8000 chromadb/chroma'");
    return;
  }

  // 3. Configure LlamaIndex's Vector Store to use ChromaDB
  const chromaVectorStore = new ChromaVectorStore({
    collectionName: CHROMA_COLLECTION_NAME,
    chromaClientParams: { path: CHROMA_HOST }
  });

  // 3. Create LlamaIndex Storage Context
  const storageContext = await storageContextFromDefaults({
    vectorStore: chromaVectorStore,
  });

  // 4. Initialize the Vector Store Index (empty initially)
  // We initialize it here so we can insert documents into it one by one.
  // Pass an empty array of documents to initialize an index that we can insert into.
  const index = await VectorStoreIndex.fromDocuments([], { storageContext });
  console.log("LlamaIndex Vector Store Index initialized and ready for insertions.");



  // 5. Find all Java files recursively
  console.log(`\nFinding .java files in '${DATA_DIR}' (including subdirectories)...`);
  let javaFilePaths: string[] = [];
  try {
      javaFilePaths = springBootFiles(DATA_DIR);
  } catch (error) {
      console.error(`Error reading directory '${DATA_DIR}':`, error);
      return;
  }

  if (javaFilePaths.length === 0) {
    console.warn(`No .java files found in '${DATA_DIR}' or its subdirectories. Exiting.`);
    return;
  }
  console.log(`Found ${javaFilePaths.length} .java files.`);

  // 6. Process and insert each Java file individually
  console.log("\nProcessing and inserting each Java file into ChromaDB...");

  for (const filePath of javaFilePaths) {
      try {
          console.log(`  Processing: ${filePath}`);
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const document = new Document({
              text: fileContent,
              metadata: { filename: filePath } // Add metadata for context
          });

          // Insert the single document into the index
          await index.insert(document);
          console.log(`    Successfully inserted ${filePath}`);

      } catch (error) {
          console.error(`  Error processing or inserting file ${filePath}:`, error);
          // Continue with the next file even if one fails
      }
  }

  console.log("\nFinished processing all Java files.");
  console.log(`All processed Java file embeddings have been loaded into ChromaDB collection: '${CHROMA_COLLECTION_NAME}'.`);







  // --- Optional: Demonstrate Querying the Index ---
  console.log("\n--- Demonstrating a simple query against the indexed data ---");
  try {
    const queryEngine = index.asQueryEngine();
    const query = "What is object-oriented programming in the context of Java?";
    console.log(`Querying: "${query}"`);
    const response = await queryEngine.query({stream:false,query});
    console.log("Query Response:");
    console.log(response.response);
  } catch (queryError) {
    console.error("\nError during query demonstration. This might happen if an LLM is not configured in ServiceContext or if the query is too complex for the indexed data:", queryError);
    console.error("If you want the query engine to work, you might need to also configure an Ollama LLM (e.g., 'llama2') in the ServiceContext.");
  }

  console.log("\nProcess completed successfully!");
}

// Execute the main function
main().catch(console.error);

// Helper function to recursively find .java files
// Updated to correctly check for multiple file extensions using a regular expression.
function springBootFiles(dir: string): string[] {
    let javaFiles: string[] = [];
    let entries;
    const filePattern = /\.(java|properties|json|xml|yml|sql)$/i;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
        console.error(`Could not read directory ${dir}: ${e}`);
        return []; // Return empty array if directory is unreadable
    }

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            javaFiles = javaFiles.concat(springBootFiles(fullPath)); // Recurse
        } else if (entry.isFile() && filePattern.test(entry.name)) {
            javaFiles.push(fullPath); // Add file if it matches the pattern
        }
    }
    return javaFiles;
}
