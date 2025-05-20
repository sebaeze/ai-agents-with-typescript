# AI Agents with Typescript

The purpose of this space is to explain and demostrate the potential of AI Agents using entirely Typescript

## What AI Agents are?

An AI Agent is a piece of software that uses AI for executing tasks. The key difference between agent versus other software is the ability of reasoning and acting based on external information.

## Catabilities of AI Agents

AI Agents follow the ReAct framework, which is described in [ReAct Framework](##reAct-framework) and they have the following capabilities:
- Planning: check balance, check slots in agenda, search for flyghts, etc
- Reasoning: 
- Acting: issue adjustment, book a meeting, etc.
- Observing
- Collaborating
- Self-refining

## ReAct Framework

The Resoning and Acting (ReAct) framework describes a technique for leveraging leveraging LLMs models by using reasoning and acting strategies. 
The approach consist of prompt a LLM in order to generate a list of "thoughts", where a though is a reasoning, in order to execute tasks (acting) that might be execute APIs, query to databases, etc.

Alternatives to ReAct framework are:
- Standard Prompting: LLM is prompted to generate a final answer or a single action and no reasoning steps.
- Chain-of-Thought (CoT) Prompting (Reason-Only): Prompting the LLM to generate a series of reasoning steps and no action taken.
- Act-Only Prompting: The LLM is prompted in order to generate sequences of actions to interact with an environment, without reasoning in the prompt.

## References
- ReAct framework: [https://arxiv.org/pdf/2210.03629](https://arxiv.org/pdf/2210.03629)
- [https://cloud.google.com/discover/what-are-ai-agents](https://cloud.google.com/discover/what-are-ai-agents)
- [https://aws.amazon.com/what-is/ai-agents/](https://aws.amazon.com/what-is/ai-agents/)
