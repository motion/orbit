/**
 * Information about GMail last sync.
 * Used to implement partial syncing.
 */
export interface GmailAppValuesLastSync {
  /**
   * History is an advanced cursor.
   * Once history id is set gmail syncer will load only newly added and removed messages.
   */
  historyId?: string

  /**
   * If last time sync wasn't finished, this value will have last cursor where sync stopped.
   */
  lastCursor?: string

  /**
   * History is an advanced cursor.
   * During first synchronization it stores history id in there.
   * Once synchronization is finished it saves this stored id into this.historyId
   * to continue history-based synchronization next time.
   */
  lastCursorHistoryId?: string

  /**
   * Number of threads was loaded and synced from the last cursor.
   */
  lastCursorLoadedCount?: number

  /**
   * Last executed filter value.
   * Used to understand if we need to re-sync all gmail data.
   */
  usedQueryFilter?: string

  /**
   * Last executed sync max value.
   * Used to understand if we need to re-sync all gmail data.
   */
  usedMax?: number

  /**
   * Last executed days limit.
   * Used to understand if we need to re-sync all gmail data.
   */
  usedDaysLimit?: number
}

/**
 * Additional GMail setting's values.
 */
export interface GmailAppValues {
  /**
   * Maximal number of emails to load.
   */
  max?: number

  /**
   * Maximal number of days to load email from current day.
   */
  daysLimit?: number

  /**
   * Special GMail filter, used to filter threads by given filter query.
   */
  filter?: string

  /**
   * Syncer will be always syncing all emails from this whitelisted emails list.
   * Whitelisted emails has two state - true and false.
   * True means they are being synced, false means they are skipped for sync.
   */
  whitelist?: { [email: string]: boolean }

  // todo
  foundEmails?: string[]

  /**
   * GMail OAuth authentication data.
   */
  oauth: {
    refreshToken: string
    secret: string
    clientId: string
  }

  /**
   * Information about threads last sync.
   * Used to implement partial syncing.
   */
  lastSync: GmailAppValuesLastSync
}

export interface GmailAppData {
  data: {}
  values: GmailAppValues
}

export interface GmailBitData {
  messages: {
    id: string
    date: number
    body: string
    participants: GmailBitDataParticipant[]
  }[]
}

export interface GmailBitDataParticipant {
  name?: string
  email: string
  type: 'from' | 'to'
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
