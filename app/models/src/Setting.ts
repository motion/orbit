export interface Setting {
  /**
   * Target type.
   */
  target: 'setting'

  id: number
  identifier: string
  category: string
  type: string
  token: string
  values: {
    // TODO: umberalla other settings into objects like this, or split this into individual simple-json fields
    // todo: having a union type also is an option
    atlassian?: {
      username: string
      password: string
      domain: string
    }
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
    repos?: Object
    calendarsActive?: Object
    syncTokens?: Object
    folders?: Array<string>
    channels?: Array<string>
    lastAttachmentSync?: { [key: string]: string }
    lastMessageSync?: { [key: string]: string }
    autoUpdate?: boolean
    autoLaunch?: boolean
    darkTheme?: boolean
    openShortcut?: string
    hasOnboarded?: boolean

    // gmail-specific options
    max?: number
    historyId?: string
    filter?: string
    lastSyncFilter?: string
    lastSyncMax?: number
  }
  createdAt: Date
  updatedAt: Date
}
