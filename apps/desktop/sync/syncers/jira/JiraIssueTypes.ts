export type JiraIssueResponse = {
  total: number
  issues: {
    id: number
    self: string
    key: string
    fields: {
      summary: string
      description: string
      created: string
      updated: string
      project: {
        id: string
        name: string
        key: string
      }
      creator: {
        name: string
        emailAddress: string
        displayName: string
      }
    }
  }[]
}

export type JiraIssue = JiraIssueResponse["issues"][0];

