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

/**
 * Jira application data.
 */
export interface JiraAppData {
  setup: {
    domain: string
    username: string
    password: string
  }
  values: {
    lastSync: JiraLastSyncInfo
  }
}

/**
 * Information about last sync.
 * Used to implement partial syncing.
 */
export interface JiraLastSyncInfo {
  /**
   * Updated date of the last synced issue.
   * We don't need to query jira issues from the api older than this date for sync.
   */
  lastSyncedDate?: number

  /**
   * If last time sync wasn't finished, this value will have last cursor where sync stopped.
   */
  lastCursor?: number

  /**
   * Updated date of the last synced issue BEFORE sync finish completely.
   *
   * Since we need to save last synced date we cannot use local variable inside syncer until sync process finish
   * because sync process can be stopped and next time start from another point where issue updated date will be different.
   *
   * We cannot use lastSyncedDate UNTIL we completely finish sync
   * because if sync stop unfinished and number of total issues will change,
   * it will make syncer to drop last cursor but it needs to have a previous value of lastSyncedDate
   * which will become different already, thus invalid.
   */
  lastCursorSyncedDate?: number

  /**
   * Number of issues was loaded and synced from the last cursor.
   */
  lastCursorLoadedCount?: number
}

/**
 * Jira additional bit information.
 */
export interface JiraBitData {
  /**
   * Html body of the jira content.
   * Used to show jira issue content body.
   */
  content: string
}
