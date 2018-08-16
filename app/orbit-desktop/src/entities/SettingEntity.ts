import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Setting, IntegrationType } from '@mcro/models'

@Entity()
export class SettingEntity extends BaseEntity implements Setting {

  target: 'setting' = 'setting'

  @PrimaryGeneratedColumn()
  id: number

  @Column({ nullable: true, unique: true })
  identifier: string

  @Column()
  category: string

  @Column()
  type: 'general' | IntegrationType

  @Column({ nullable: true })
  token: string

  @Column('simple-json', { default: '{}' })
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
    autoLaunch?: boolean
    openShortcut?: string
    hasOnboarded?: boolean

    // gmail-specific options
    max?: number
    historyId?: string
    filter?: string
    lastSyncFilter?: string
    lastSyncMax?: number
    whiteList?: { [key: string]: boolean }
  }

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

}
