/*
* Test for JIRA API client utility
*/
import "dotenv/config";
import { searchJiraIssuesByEmail } from "./jiraClient";

const testSearchJiraIssues = async () => {
    console.log("Starting JIRA client test...");

    const assigneeEmail = process.env.JIRA_USER_EMAIL;

    if (!assigneeEmail) {
        console.error("Test failed: JIRA_USER_EMAIL environment variable is not set.");
        process.exit(1);
    }

    try {
        console.log(`Fetching JIRA issues for: ${assigneeEmail}`);
        const issues = await searchJiraIssuesByEmail(assigneeEmail);
        console.log(`Found ${issues.length} issues:`);
        issues.forEach(issue => console.log(`  - ${issue.key}: ${issue.fields.summary}`));
        console.log("JIRA client test completed successfully.");
    } catch (error) {
        console.error("JIRA client test failed:", error);
    }
};

testSearchJiraIssues();