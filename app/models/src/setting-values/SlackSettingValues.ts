export interface SlackSettingValues {
  oauth?: {
    refreshToken: string
    secret: string
    clientId: string

    // slack-specific
    info?: {
      team?: {
        id?: string
        domain?: string
      }
    }
  }
  channels?: Array<string>
  lastAttachmentSync?: { [key: string]: string }
  lastMessageSync?: { [key: string]: string }
}
