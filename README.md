# AI Agents with Typescript

The purpose of this space is to explain and demostrate the potential of AI Agents using entirely Typescript

## What AI Agents are?

An AI Agent is a piece of software that uses AI for executing tasks. 

The key difference between agent versus other software is the ability of reasoning and acting based on external information. An example of this behaviour is the use of ReAct framework, which is described in [ReAct Framework](##reAct-framework).

Some of the components of an AI Agent are: planning, memory, tools and action.

## Types of Agents

Anthropic defines two main categories:
- Workflow: Systems where the flow is controlled by a pre-defined path.
- Agents: Systems where LLMs defines the flow dynamically.

### Workflow Design Patterns

- Prompt chainning: The final result is obtained by splitting a major work into smaller tasks, which are executed by LLMs in sequence.
- Routing: The LLM decides the next step to execute in a flow.
- Parallelization: A software like python, js, etc orchestrates multiple LLMs to execute task in parallel to solve a problem.
- Orchestrator-worker: A LLM defines the tasks and orquestate multiple LLMs to execute the tasks in parallel to solve a problem.
- Evaluator-Optimizer: A LLM evaluates the output of other LLMs and provides feedback to improve the result.


## Tool calling

A tool is a function schema, which contains information such as name; description; parameters, and It is available to the LLM.
Tool calling is the ability of a LLM to invoke the tools in order to interact with the environment, for example: get current time, fetch meetings in a calendar, etc.



### References
- [https://www.youtube.com/watch?v=h8gMhXYAv1k](https://www.youtube.com/watch?v=h8gMhXYAv1k)


### Planning

This process decompone the work into smaller steps & actions. There are several strategies for planning, such as:
- Chain-of-Thought (CoT): Enhances the reasoning capability by decomposing the task in several steps, which are executed in sequence in order to elaborate an output.
- Tree of Through reasoning (ToT): This strategy split the work in several paths and tasks. Unlike CoT strategy, the tasks are executed in parallel, since multiple paths are evaluated at the same time.
- Planning with Feedback / ReAct (Reasoning and Act): Described in [ReAct Framework](##reAct-framework).

### Memory

This component allows AI Agents to retain information about past experience in order to learn, adapt and make better decisions.

### Tools

External funcionalities, such as REST APIs, that let the AI Agent interact with external entities.

### Action

The task that is executed by the Agent, for example reserving a meeting by using a tool.

### ReAct Framework

The Resoning and Acting (ReAct) framework describes a technique for leveraging LLMs models by using reasoning and acting strategies. 
The approach consist of prompt a LLM in order to generate a list of "thoughts", where a though is a reasoning, in order to execute tasks (acting) that might be execute APIs, query to databases, etc.

## Popular libraries

### Vercel AI SDK

Typescript library provided by Vercel, which focus on Typescript and Next.js solutions.

Pros:
- Easy integration with Next.js/React
- Streaming support
- Robust documentation

Cons:
- Limited to web frameworks
- Requires external LLM APIs

### Autogen

Open source library from Microsoft for building multi-agents AI applications.

Pros:
- Enables multi-agent development
- Includes human in the loop
- Optimize LLM performace

Cons:
- Steep curve of learning
- Lack of visual editor

### OpenAI Agent SDK

- [https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)

### Langchain
- Framework for bulding LLM applications
- Pre-built interfaces and integrations
- Abstractions for: chains and agents

### LlamaIndex
-
-
-

## 00_langchain_ollama_pynecone

### Prerequisites

*   Node.js and npm/yarn installed.
*   Ollama installed and running. You can download it from ollama.com.
*   At least one chat model (e.g., `llama2`) and one embedding model (e.g., `nomic-embed-text`) pulled via Ollama:
    ```bash
    ollama pull llama2
    ollama pull nomic-embed-text
    ```
*   A Pinecone account and an API key. You will also need to have created a Pinecone index.

### Setup

1.  **Clone the repository (if applicable).**
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the `00_langchain_ollama_pynecone` directory with the following content, replacing the placeholder values with your actual credentials and desired settings:

    ```env
    PINECONE_API_KEY="YOUR_PINECONE_API_KEY"
    PINECONE_INDEX_NAME="your-pinecone-index-name"

    # Optional: Override default Ollama models and API URL
    OLLAMA_MODEL="llama2"
    OLLAMA_EMBEDDINGS_MODEL="nomic-embed-text:latest" # Model for generating embeddings
    OLLAMA_EMBEDDINGS_URL="http://localhost:11434/api/embeddings" # Ollama embeddings API endpoint
    ```

4.  **Prepare your TypeScript code:**
    Place the TypeScript files you want to query into a directory. By default, `ingest.ts` looks for a directory named `your-typescript-code-directory` in the same location as `ingest.ts`. You can change this path in `ingest.ts` if needed.


## References
- ReAct framework: [https://arxiv.org/pdf/2210.03629](https://arxiv.org/pdf/2210.03629)
- [https://cloud.google.com/discover/what-are-ai-agents](https://cloud.google.com/discover/what-are-ai-agents)
- [https://aws.amazon.com/what-is/ai-agents/](https://aws.amazon.com/what-is/ai-agents/)
- [https://www.anthropic.com/engineering/building-effective-agents](https://www.anthropic.com/engineering/building-effective-agents)
- 