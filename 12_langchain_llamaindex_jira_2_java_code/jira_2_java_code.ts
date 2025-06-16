/*
*
*/
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/ollama";
import { RunnablePassthrough, RunnableLambda } from "@langchain/core/runnables";
import "dotenv/config";
import { searchJiraIssuesByEmail } from "../utils/jiraClient";
//
const llm = new ChatOllama({
    model: process.env.OLLAMA_MODEL,
    topK: 10,
    topP: 0.5
});
//
const concatenateTextFields = (content: any[]): string => {
  let concatenatedText = '';

  function extractText(contentArray: any[]) {
      for (const item of contentArray) {
          if (item.type === 'text' && item.text) {
              concatenatedText += item.text + ' ';
          } else if (item.content && Array.isArray(item.content)) {
              extractText(item.content);
          }
      }
  }
  extractText(content);
  return concatenatedText.trim();
}
//
async function getJiraIssues(input: { EMAIL_ADDRESS: string }): Promise<string> {
    console.log(`[JIRA Client] Fetching issues for: ${input.EMAIL_ADDRESS}`);
    const issues = await searchJiraIssuesByEmail(input.EMAIL_ADDRESS);
    const issuesString = issues.map(issue => { return `Issue ${issue.key}: ${issue.fields.summary}\n Description:\n${concatenateTextFields(issue.fields?.description?.content||[""])}`;}).join("\n\n- ");
    console.log("\n\n  (B) issuesString: ",issuesString,"\n\n");
    //
    return issuesString;
}
//
const main = async () => {
    try {
        const promptTemplate = ChatPromptTemplate.fromMessages([
            ["system","You are a helpfull AI assistant expert in developing Java code. You must interprete the user requirement and translate It to techical requirements. Your responses should only be Java code, no description should be included."],
            ["user","My email es {EMAIL_ADDRESS} and you should create a Java code using a model in ollama for the description from the following JIRA issues:\n\n{JIRA_ISSUES_LIST}"]
        ])
        //
        const chain = RunnablePassthrough.assign({
            JIRA_ISSUES_LIST: new RunnableLambda({ func: getJiraIssues })
        }).pipe(promptTemplate).pipe(llm) ;
        //
        const res = await chain.invoke({EMAIL_ADDRESS: process.env.JIRA_USER_EMAIL });
        // 
        console.log(res.content);
        //
    } catch(err){
        console.log(err);
    }
}
//
main();
//