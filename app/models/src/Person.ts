import { IntegrationType } from './IntegrationType'
import { PersonData } from './person-data/PersonData'
import { PersonBit } from './PersonBit'
import { Setting } from './Setting'

export interface Person {

  /**
   * Target type.
   */
  target: 'person'

  id: number
  contentHash: number
  integration: IntegrationType
  integrationId: string
  createdAt: Date
  updatedAt: Date
  email: string
  photo: string
  name: string
  setting: Setting
  settingId: number
  data: PersonData
  raw: any
  personBit: PersonBit
  webLink: string
  desktopLink: string

}
