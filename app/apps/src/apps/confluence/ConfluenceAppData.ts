
/**
 * Information about last sync.
 * Used to implement partial syncing.
 */
export interface ConfluenceLastSyncInfo {
  /**
   * Updated date of the last synced content.
   * We don't need to query confluence content from the api older than this date for sync.
   */
  lastSyncedDate?: number

  /**
   * If last time sync wasn't finished, this value will have last cursor where sync stopped.
   */
  lastCursor?: number

  /**
   * Updated date of the last synced content BEFORE sync finish completely.
   *
   * Since we need to save last synced date we cannot use local variable inside syncer until sync process finish
   * because sync process can be stopped and next time start from another point where content updated date will be different.
   *
   * We cannot use lastSyncedDate UNTIL we completely finish sync
   * because if sync stop unfinished and number of total content will change,
   * it will make syncer to drop last cursor but it needs to have a previous value of lastSyncedDate
   * which will become different already, thus invalid.
   */
  lastCursorSyncedDate?: number

  /**
   * Number of content was loaded and synced from the last cursor.
   */
  lastCursorLoadedCount?: number
}

export interface ConfluenceAppData {
  values: {
    credentials: {
      domain: string
      username: string
      password: string
    }
    pageLastSync: ConfluenceLastSyncInfo
    blogLastSync: ConfluenceLastSyncInfo
  }
  data: {}
}
