/**
 * Interface for GMail query.
 */
export type GMailFetchOptions<_T> = {
  url: string
  query?: { [key: string]: any }
}

/**
 * @see https://developers.google.com/gmail/api/v1/reference/users/getProfile
 */
export type GMailUserProfile = {
  emailAddress: string
  messagesTotal: number
  threadsTotal: number
  historyId: number
}

/**
 * @see https://developers.google.com/gmail/api/v1/reference/users/threads#resource
 */
export type GMailThread = {
  id: string
  snippet: string
  historyId: string
  messages: GMailMessage[]
}

/**
 * @see https://developers.google.com/gmail/api/v1/reference/users/messages#resource
 */
export type GMailMessage = {
  id: string
  threadId: string
  labelIds: string[]
  snippet: string
  historyId: string
  internalDate: string
  payload: {
    headers: {
      name: string
      value: string
    }[]
    parts: {
      mimeType: string
      body: {
        size: number
        data: string
      }
    }[]
    body: {
      size: number
      data: string
    }
    mimeType: string
  }
}

/**
 * @see https://developers.google.com/gmail/api/v1/reference/users/threads/list
 */
export type GMailThreadResult = {
  threads: GMailThread[]
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
export type GMailHistory = {
  historyId: string
  nextPageToken: string
  history: {
    messages: {
      id: string
      threadId: string
    }[]
    messagesAdded: GMailHistoryMessageAction[]
    messageDeleted: GMailHistoryMessageAction[]
    labelsAdded: GMailHistoryMessageAction[]
    labelsRemoved: GMailHistoryMessageAction[]
  }[]
}

/**
 * Part of the gmail history object.
 *
 * @see https://developers.google.com/gmail/api/v1/reference/users/history/list
 */
export type GMailHistoryMessageAction = {
  message: {
    id: string
    threadId: string
  }
  labelIds?: string[]
}

export type GMailHistoryLoadResult = {
  historyId: string
  addedThreadIds: string[]
  removedThreadIds: string[]
}