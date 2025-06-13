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

### Comparative table

| Name | Provider | Description | Best For | Pros | Cons |
| :------------------ | :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Vercel AI SDK** | Vercel | A TypeScript SDK for building AI-powered applications and agents, offering a unified API for integrating various LLMs (OpenAI, Anthropic, Google, etc.) into web frameworks like React, Next.js, Svelte, and Vue. Supports streaming AI responses and tool calls. | Web developers building AI-powered web applications and UIs, especially with Next.js and React. | Unified API for multiple LLM providers; seamless integration with modern web frameworks; excellent for streaming AI responses and generative UIs; strong focus on developer experience and rapid prototyping; supports serverless functions and edge deployments. | Can feel Vercel-dependent for deployment; documentation might need more step-by-step guides for serverless tech; potentially limited support for frameworks outside the Vercel ecosystem (though expanding); troubleshooting can be challenging. |
| **Autogen** | Microsoft | An open-source framework that enables the development of LLM applications using multiple conversable agents that can communicate, reason, and solve problems together. It simplifies complex orchestration, automation, and optimization of LLM workflows. | Building multi-agent conversation systems, automating complex workflows, code generation and debugging, and research projects requiring collaborative AI. | Simplifies multi-agent orchestration and communication; supports various agent types (Assistant, User Proxy, Group Chat Manager); built-in code execution and tool usage; robust error handling; offers Autogen Studio for low-code interaction; backed by Microsoft. | Can have a learning curve; documentation sometimes lacks enough examples; structured outputs can be challenging; integration with certain external tools might require extra effort; streaming output was a recent addition, not always available out-of-the-box in older versions. |
| **OpenAI Assistants API** | OpenAI | A new API by OpenAI that simplifies building AI assistants by handling state management (conversation history), code execution, and knowledge retrieval. It allows developers to create persistent AI agents with baked-in instructions and tools. | Developers looking to build conversational AI assistants with persistent memory, code interpretation, and document retrieval using OpenAI models. | Abstracts away complexities like context window management and conversation history; built-in tools (Code Interpreter, Retrieval, Function Calling) simplify agent capabilities; easy to get started for beginners, even with the Playground; enables consistent and accurate responses through baked-in instructions. | Vendor lock-in to OpenAI models; less customization compared to lower-level APIs (especially in RAG); still in beta, so features and pricing might change; can be more expensive for complex usage or extensive training; retrieval system can be hit-or-miss; may lack fine-grained model controls (e.g., `top_p`, `temperature`). |
| **LangChain** | Open-source (H. Chase, LangChain Inc.) | A comprehensive framework for developing applications powered by language models. It provides modular components for chaining LLMs with external data sources, computation, and agents, enabling complex workflows like RAG and multi-step reasoning. | Building end-to-end LLM applications, RAG systems, complex agents with tool use, and applications requiring integration with diverse data sources and APIs. | Highly modular and flexible; extensive ecosystem of integrations (LLMs, vector stores, tools); strong community support; excellent for RAG and complex prompt chaining; supports various programming languages (Python, JS/TS); constantly updated with new features. | Can have a steep learning curve due to its extensive modules and flexibility; documentation can sometimes be inconsistent or outdated given rapid development; can feel overly complex for simple tasks; potential performance overheads due to abstraction layers; dependency management can be challenging. |
| **LlamaIndex** | Open-source (Jerry Liu, LlamaIndex Inc.) | A data framework designed to make it easy to ingest, structure, and access private or domain-specific data with LLMs. It focuses on providing tools for building knowledge-augmented applications like Q&A systems and advanced retrieval. | Applications requiring efficient data ingestion, indexing, and retrieval over large, private datasets (e.g., internal knowledge bases, document analysis, Q&A systems). | Excellent for RAG (Retrieval Augmented Generation); supports a wide range of data connectors and formats; advanced indexing strategies (vector, tree, etc.) for fast and accurate retrieval; can handle large datasets efficiently; provides both high-level and low-level APIs for flexibility; integrates well with LLM agents. | Requires a good understanding of indexing and data management concepts; initial setup for advanced customization can be complex; may have performance issues with extremely massive datasets; dependency management can be challenging; more specialized for data retrieval compared to general agent frameworks. |

### Reference

- [https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf)

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