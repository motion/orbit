import { PersonBit } from './PersonBit'
import { Setting } from './Setting'

export interface Person {

  /**
   * Target type.
   */
  target: "person"

  id: number
  identifier: string
  integration: "slack"|string // todo: need to specify all possible integration types here
  integrationId: string
  createdAt: Date
  updatedAt: Date
  name: string
  setting: Setting
  settingId: number
  data: SlackPersonData // todo: write down all other data types from other integrations
  personBit: PersonBit

}

// todo: extract out of here later
export interface SlackPersonData {
  name: string
  email: string
  phone: string
  profile?: {
    image_48?: string
  }
}