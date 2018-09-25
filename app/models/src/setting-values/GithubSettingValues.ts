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

  repos?: Object
  oauth: {
    refreshToken: string
    secret: string
    clientId: string
  }
}
