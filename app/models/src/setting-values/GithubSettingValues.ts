export interface GithubSettingValues {
  repos?: Object
  oauth: {
    refreshToken: string
    secret: string
    clientId: string
  }
}
