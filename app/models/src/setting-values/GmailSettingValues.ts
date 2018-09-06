export interface GmailSettingValues {
  oauth: {
    refreshToken: string
    secret: string
    clientId: string
  }
  max?: number
  historyId?: string
  filter?: string
  lastSyncFilter?: string
  lastSyncMax?: number
  whiteList?: any
}
