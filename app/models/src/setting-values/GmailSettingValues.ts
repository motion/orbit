/**
 * Additional GMail setting's values.
 */
export interface GmailSettingValues {

  /**
   * History is an advanced cursor.
   * History id represents latest loaded cursor.
   */
  historyId?: string

  /**
   * Maximal number of emails to load.
   */
  max?: number

  /**
   * Maximal number of month to load email from current day.
   */
  monthLimit?: number

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
   * Last executed filter value.
   * Used to understand if we need to re-sync all gmail data.
   */
  lastSyncFilter?: string

  /**
   * Last executed sync max value.
   * Used to understand if we need to re-sync all gmail data.
   */
  lastSyncMax?: number

  /**
   * Last executed month limit.
   * Used to understand if we need to re-sync all gmail data.
   */
  lastSyncMonthLimit?: number

  /**
   * GMail OAuth authentication data.
   */
  oauth: {
    refreshToken: string
    secret: string
    clientId: string
  }

}
