/*
*
*/
declare namespace NodeJS {
    interface ProcessEnv {
        OLLAMA_MODEL: string;
        JIRA_BASE_URL?: string;      // Example: your-domain.atlassian.net
        JIRA_USER_EMAIL?: string;    // Email for API token authentication
        JIRA_API_TOKEN?: string;     // JIRA API Token
        JIRA_SEARCH_STATUS?:string;
        JIRA_MAX_RESULTS?: string;
    }
}