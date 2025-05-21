# AI Agents with Typescript

The purpose of this space is to explain and demostrate the potential of AI Agents using entirely Typescript

## What AI Agents are?

An AI Agent is a piece of software that uses AI for executing tasks. The key difference between agent versus other software is the ability of reasoning and acting based on external information.
/* AI Agents follow the ReAct framework, which is described in [ReAct Framework](##reAct-framework). */
The major components of AI Agents are: planning, memory, tools and action.

### Planning

This process decompone the work into smaller steps & actions. There are several strategies for planning, such as:
- Chain-of-Thought (CoT): Enhances the reasoning capability by decomposing the task in several steps, which are executed in sequence in order to elaborate an output.
- Tree of Through reasoning (ToT): This strategy split the work in several paths and tasks. Unlike CoT strategy, the tasks are executed in parallel, since multiple paths are evaluated at the same time.
- Planning with Feedback / ReAct (Reasoning and Act): Described in [ReAct Framework](##reAct-framework).

## Memory

This component allows AI Agents to retain information about past experience in order to learn, adapt and make better decisions.

## Tools

External funcionalities, such as REST APIs, that let the AI Agent interact with external entities.

## Action

The task that is executed by the Agent, for example reserving a meeting by using a tool.

## ReAct Framework

The Resoning and Acting (ReAct) framework describes a technique for leveraging LLMs models by using reasoning and acting strategies. 
The approach consist of prompt a LLM in order to generate a list of "thoughts", where a though is a reasoning, in order to execute tasks (acting) that might be execute APIs, query to databases, etc.

## References
- ReAct framework: [https://arxiv.org/pdf/2210.03629](https://arxiv.org/pdf/2210.03629)
- [https://cloud.google.com/discover/what-are-ai-agents](https://cloud.google.com/discover/what-are-ai-agents)
- [https://aws.amazon.com/what-is/ai-agents/](https://aws.amazon.com/what-is/ai-agents/)
