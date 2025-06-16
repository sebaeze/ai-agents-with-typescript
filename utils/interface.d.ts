//
export interface JiraIssue {
    id: string;
    key: string;
    self: string;
    fields: {
        summary: string;
        [key: string]: any;
    };
}