import * as T from './typeorm'

@T.Entity()
export class Setting extends T.BaseEntity {
  @T.PrimaryGeneratedColumn() id: number

  // use for determining if oauth is from same account as previous one
  @T.Column({ nullable: true, unique: true })
  identifier: string

  @T.Column() category: string

  @T.Column() type: string

  @T.Column({ nullable: true })
  token: string

  @T.Column('simple-json', { default: '{}' })
  values: {
    // TODO: umberalla other settings into objects like this, or split this into individual simple-json fields
    atlassian?: {
      username: string
      password: string
      domain: string
    }
    oauth?: Object
    repos?: Object
    calendarsActive?: Object
    syncTokens?: Object
    folders?: Array<string>
    historyId?: string
    syncSettings?: any
    lastSyncSettings?: any
    channels?: Array<string>
    lastAttachmentSync?: { [key: string]: string }
    lastMessageSync?: { [key: string]: string }
    autoLaunch?: boolean
    openShortcut?: string
  }

  @T.CreateDateColumn() createdAt: Date

  @T.UpdateDateColumn() updatedAt: Date
}

