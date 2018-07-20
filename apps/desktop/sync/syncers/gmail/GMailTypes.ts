
export type GmailFetchOptions<_T> = {
  url: string
  query?: { [key: string]: any }
}

/**
 * @see https://developers.google.com/gmail/api/v1/reference/users/getProfile
 */
export type GmailUserProfile = {
  emailAddress: string
  messagesTotal: number
  threadsTotal: number
  historyId: number
}

/**
 * @see https://developers.google.com/gmail/api/v1/reference/users/threads#resource
 */
export type GmailThread = {
  id: string
  snippet: string
  historyId: string
  messages: GmailMessage[]
}

/**
 * @see https://developers.google.com/gmail/api/v1/reference/users/messages#resource
 */
export type GmailMessage = {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  historyId: string
  internalDate: string
  payload: {
    headers: { name: string; value: string }[]
  }
}

/**
 * @see https://developers.google.com/gmail/api/v1/reference/users/threads/list
 */
export type GmailThreadResult = {
  threads: GmailThread[]
  nextPageToken: string
  resultSizeEstimate: number
}

/**
 *
 * Note: if there are no new actions in the history (for example no new emails)
 * GMail will send only historyId in a response without a history object
 *
 * @see https://developers.google.com/gmail/api/v1/reference/users/history/list
 */
export type GmailHistory = {
  historyId: string
  nextPageToken: string
  history: {
    messages: {
      id: string
      threadId: string
    }[]
    messagesAdded: GmailHistoryMessageAction[]
    messageDeleted: GmailHistoryMessageAction[]
    labelsAdded: GmailHistoryMessageAction[]
    labelsRemoved: GmailHistoryMessageAction[]
  }[]
}

/**
 * Part of the gmail history object.
 *
 * @see https://developers.google.com/gmail/api/v1/reference/users/history/list
 */
export type GmailHistoryMessageAction = {
  message: {
    id: string
    threadId: string
  }
  labelIds?: string[]
}

export type GmailHistoryLoadResult = {
  historyId: string
  addedThreadIds: string[]
  removedThreadIds: string[]
}