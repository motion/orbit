import { IntegrationType } from './IntegrationType'
import { PersonData } from './person-data/PersonData'
import { PersonBit } from './PersonBit'
import { Source } from './Source'

export interface Person {
  /**
   * Target type.
   */
  target: 'person'

  id?: number
  contentHash?: number
  integration?: IntegrationType
  integrationId?: string
  createdAt?: Date
  updatedAt?: Date
  email?: string
  photo?: string
  name?: string
  source?: Source
  sourceId?: number
  data?: PersonData
  personBit?: PersonBit
  webLink?: string
  desktopLink?: string
}
