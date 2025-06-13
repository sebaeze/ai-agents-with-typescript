# Langchain with Ollama Basic Example

This project demonstrates a basic interaction with a locally running Ollama Large Language Model (LLM) using Langchain in TypeScript. It sends a predefined question ("Which is the capital of France?") to the LLM and prints the response to the console.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: Version 18 or higher is recommended. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm** or **yarn**: These package managers come with Node.js.
*   **Ollama**: Installed and running. You can download it from [ollama.com](https://ollama.com/).
*   **An Ollama Model**: The script defaults to `orieg/gemma3-tools:1b`. You need to pull this model (or any other model you wish to use) into your Ollama instance.
    To pull the default model, run:
    ```bash
    ollama pull orieg/gemma3-tools:1b
    ```

## Setup

1.  **Clone the repository (Optional):**
    If you have cloned a larger project containing this example, navigate to the `00_langchain_basic_ollama` directory. Otherwise, ensure you have the `index.ts` file.

2.  **Install Dependencies:**
    Open your terminal in the project directory (`00_langchain_basic_ollama`) and run:
    ```bash
    npm install
    ```
    This will install the necessary packages:
    *   `@langchain/ollama`: For Langchain integration with Ollama.
    *   `dotenv`: For managing environment variables.

    If you don't have `typescript` and `ts-node` installed (globally or as project dev dependencies), you might need to install them to run the script directly with `ts-node` or to compile it:
    ```bash
    npm install -D typescript ts-node @types/node
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the `00_langchain_basic_ollama` directory with the following content:

    ```env
    OLLAMA_BASE_URL="http://localhost:11434"
    OLLAMA_MODEL="orieg/gemma3-tools:1b"
    ```

    *   `OLLAMA_BASE_URL`: The base URL for your running Ollama instance. Defaults to `http://localhost:11434` in the script if not set.
    *   `OLLAMA_MODEL`: The name of the Ollama model you want to use. Defaults to `orieg/gemma3-tools:1b` in the script if not set. (Note: The script originally had a typo `MOLLAMA_MODEL` for this environment variable, which has been corrected in the suggested `index.ts` changes to `OLLAMA_MODEL`).
    
    **Note:** The script includes default values, so creating a `.env` file is optional if the defaults match your setup, but it's good practice for custom configurations.

## Running the Script

Ensure your Ollama application is running and the specified model is available.

To run the TypeScript script directly, use `ts-node`:
```bash
npx ts-node index.ts
```

Alternatively, you can compile the TypeScript to JavaScript first and then run the JavaScript file:
1.  Compile:
    ```bash
    npx tsc index.ts
    ```
2.  Run:
    ```bash
    node index.js
    ```

Upon successful execution, the script will output the LLM's response to the question "Which is the capital of France?".

## Code Overview (`index.ts`)

The `index.ts` script performs the following:

1.  **Imports:**
    *   `ChatOllama` from `@langchain/ollama`: The Langchain class for interacting with Ollama chat models.
    *   `dotenv/config`: To automatically load environment variables from a `.env` file into `process.env`.

2.  **Ollama Model Initialization:**
    *   An instance of `ChatOllama` is created.
    *   `baseUrl`: Configured using `process.env.OLLAMA_BASE_URL` or defaults to `"http://localhost:11434"`.
    *   `model`: Configured using `process.env.OLLAMA_MODEL` or defaults to `"orieg/gemma3-tools:1b"`.

3.  **`main` Function:**
    *   An asynchronous function `main` is defined to encapsulate the core logic.
    *   `ollamaModel.invoke("Which is the capital of France?")`: This line sends the question as a string to the configured Ollama model. The `invoke` method is a simple way to get a direct response for a single input.
    *   `console.log(response)`: The response received from the LLM is printed to the console.

4.  **Execution:**
    *   The `main()` function is called to start the script.

This script provides a straightforward example of how to connect to a local Ollama LLM and get a response using Langchain.