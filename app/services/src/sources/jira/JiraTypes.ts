/**
 * A single jira issue.
 *
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/#api-api-2-user-get
 */
export type JiraUser = {
  accountId: string
  self: string
  key: string
  name: string
  emailAddress: string
  displayName: string
  avatarUrls: {
    '48x48': string
  }
}

/**
 * Response returned when we load jira issues.
 */
export type JiraIssueCollection = {
  total: number
  issues: JiraIssue[]
}

/**
 * Response returned when we load jira comments.
 */
export type JiraCommentCollection = {
  total: number
  comments: JiraComment[]
}

/**
 * Jira issue comment.
 *
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/#api-api-2-issue-issueIdOrKey-comment-get
 */
export type JiraComment = {
  body: string
  author: JiraUser
}

/**
 * Jira issue.
 *
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/#api-api-2-issue-issueIdOrKey-get
 */
export type JiraIssue = {
  id: string
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
    comment: {
      total: number
    }
    creator: JiraUser
    assignee: JiraUser
    reporter: JiraUser
  }
  renderedFields: {
    description: string
  }
  // custom properties
  comments: JiraComment[]
}
