/**
 * Information about last sync.
 * Used to implement partial syncing.
 */
export interface DriveLastSyncInfo {
  /**
   * Updated date of the last synced file.
   * We don't need to query files from the api older than this date for sync.
   */
  lastSyncedDate?: number

  /**
   * If last time sync wasn't finished, this value will have last cursor where sync stopped.
   */
  lastCursor?: string

  /**
   * Updated date of the last synced file BEFORE sync finish completely.
   *
   * Since we need to save last synced date we cannot use local variable inside syncer until sync process finish
   * because sync process can be stopped and next time start from another point where file updated date will be different.
   *
   * We cannot use lastSyncedDate UNTIL we completely finish sync
   * because if sync stop unfinished and number of total files will change,
   * it will make syncer to drop last cursor but it needs to have a previous value of lastSyncedDate
   * which will become different already, thus invalid.
   */
  lastCursorSyncedDate?: number
}

export interface DriveAppValues {
  oauth: {
    refreshToken: string
    secret: string
    clientId: string
  }

  lastSync: DriveLastSyncInfo
}

export interface DriveAppData {
  data: {}
  values: DriveAppValues
}
