/**
 * Information about GMail last sync.
 * Used to implement partial syncing.
 */
export interface GmailSourceValuesLastSync {

  /**
   * Updated date of the last synced thread.
   * We don't need to query threads from the api older than this date for sync.
   */
  lastSyncedDate?: number

  /**
   * If last time sync wasn't finished, this value will have last cursor where sync stopped.
   */
  lastCursor?: string

  /**
   * Updated date of the last synced thread BEFORE sync finish completely.
   *
   * Since we need to save last synced date we cannot use local variable inside syncer until sync process finish
   * because sync process can be stopped and next time start from another point where thread updated date will be different.
   *
   * We cannot use lastSyncedDate UNTIL we completely finish sync
   * because if sync stop unfinished and number of total threads will change,
   * it will make syncer to drop last cursor but it needs to have a previous value of lastSyncedDate
   * which will become different already, thus invalid.
   */
  lastCursorSyncedDate?: number

  /**
   * Number of threads was loaded and synced from the last cursor.
   */
  lastCursorLoadedCount?: number

  /**
   * History is an advanced cursor.
   * History id represents latest loaded cursor.
   */
  historyId?: string

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
export interface GmailSourceValues {

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
  lastSync: GmailSourceValuesLastSync
}
