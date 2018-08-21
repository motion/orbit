import { IntegrationType } from './IntegrationType'
import { ConfluencePersonData } from './person-data/ConfluencePersonData'
import { JiraPersonData } from './person-data/JiraPersonData'
import { SlackPersonData } from './person-data/SlackPersonData'
import { PersonBit } from './PersonBit'
import { Setting } from './Setting'

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
  email: string
  photo: string
  name: string
  setting: Setting
  settingId: number
  data: SlackPersonData | ConfluencePersonData | JiraPersonData
  personBit: PersonBit
  webLink: string
  desktopLink: string

}
