/*
* JIRA API client utility
*/
import "dotenv/config";
import { JiraIssue } from "./interface";
/**
 * Searches JIRA issues assigned to a specific email address.
 * @param assigneeEmail The email address of the assignee.
 * @returns A promise that resolves to an array of JIRA issues.
 * @throws Error if required environment variables are not set or if the API request fails.
 */
export const searchJiraIssuesByEmail = async (assigneeEmail: string): Promise<JiraIssue[]> => {
    const { JIRA_BASE_URL, JIRA_USER_EMAIL, JIRA_API_TOKEN } = process.env;

    if (!JIRA_BASE_URL || !JIRA_USER_EMAIL || !JIRA_API_TOKEN) {
        throw new Error(
            "JIRA environment variables (JIRA_BASE_URL, JIRA_USER_EMAIL, JIRA_API_TOKEN) must be set."
        );
    }

    if (!assigneeEmail) {
        throw new Error("Assignee email must be provided.");
    }

    const jql = `assignee = "${assigneeEmail}" AND status IN (${process.env.JIRA_SEARCH_STATUS||"Open"}) ORDER BY created DESC`;
    // Specify the fields to retrieve: id, key, self are top-level.
    // assignee, summary, description are within the 'fields' object.
    const fieldsToRetrieve = "summary,description,assignee,fields";
    const maxResults = process.env.JIRA_MAX_RESULTS || "1";

    const searchParams = new URLSearchParams({ jql, fields: fieldsToRetrieve, maxResults });
    const url = `https://${JIRA_BASE_URL}/rest/api/3/search?${searchParams.toString()}`;

    const authToken = Buffer.from(`${JIRA_USER_EMAIL}:${JIRA_API_TOKEN}`).toString("base64");

    const response = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Basic ${authToken}`,
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`JIRA API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return (data.issues || []) as JiraIssue[];
};