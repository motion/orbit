import { PersonData } from '../person-data/PersonData'
import { PersonBit } from './PersonBit'
import { Source } from './Source'
import { SourceType } from './SourceType'

export interface Person {
  /**
   * Target type.
   */
  target: 'person'

  id?: number
  contentHash?: number
  userId?: string
  sourceType?: SourceType
  sourceId?: number
  createdAt?: Date
  updatedAt?: Date
  email?: string
  photo?: string
  name?: string
  source?: Source
  data?: PersonData
  personBit?: PersonBit
  webLink?: string
  desktopLink?: string
}
