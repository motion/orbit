export interface GmailSettingValues {
  oauth: {
    refreshToken: string
    secret: string
    clientId: string
  }
  max?: number
  monthLimit?: number
  historyId?: string
  filter?: string
  lastSyncFilter?: string
  lastSyncMax?: number
  lastSyncMonthLimit?: number
  whitelist?: string[]
  foundEmails?: string[]
}
