export interface SlackSettingValues {

  oauth?: {
    refreshToken: string

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