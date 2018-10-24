
/**
 * Information about repository last sync.
 * Used to implement partial syncing.
 */
export interface GithubSettingValuesLastSyncRepositoryInfo {

  /**
   * Updated date of the last synced issue.
   * We don't need to query github issues/prs from the api older than this date for sync.
   */
  lastSyncedDate?: number

  /**
   * If last time sync wasn't finished, this value will have last cursor where sync stopped.
   */
  lastCursor?: string

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

export interface GithubSettingValues {
  /**
   * By default we sync all github repositories.
   * This called "sync all mode". We use this mode until whitelist is undefined.
   * User can exclude repositories from sync by not including them in the whitelist.
   * Once he excludes any repository from the list, whitelist of all repositories is created
   * excluding excluded repositories. All new repositories won't be synced in this mode.
   * To disable whitelist mode and enable sync all mode it should be set to undefined.
   */
  whitelist?: string[]

  /**
   * List of public repositories (other than ones he owns) that we need to sync.
   */
  externalRepositories: string[]

  /**
   * Information about repository last sync.
   * Used to implement partial syncing.
   */
  lastSyncRepositories: {
    [repository: string]: GithubSettingValuesLastSyncRepositoryInfo
  }

  oauth: {
    refreshToken: string
    secret: string
    clientId: string
  }
}
