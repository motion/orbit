import { IntegrationType } from './IntegrationType'
import { PersonBit } from './PersonBit'
import { Setting } from './Setting'
import { SlackPersonData } from './person-data/SlackPersonData'

export interface Person {

  /**
   * Target type.
   */
  target: 'person'

  id: string
  integration: IntegrationType
  integrationId: string
  createdAt: Date
  updatedAt: Date
  name: string
  setting: Setting
  settingId: number
  data: SlackPersonData
  personBit: PersonBit
  webLink: string
  desktopLink: string


}
