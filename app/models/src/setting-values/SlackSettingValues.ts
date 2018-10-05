export interface SlackSettingValues {
  whitelist: string[]
  oauth?: {
    refreshToken: string
    secret: string
    clientId: string
  }
  channels?: Array<string>
  lastAttachmentSync?: { [key: string]: string }
  lastMessageSync?: { [key: string]: string }
  team: {
    id: string
    name: string
    domain: string
    icon: string
  }
}
