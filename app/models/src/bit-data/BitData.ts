import { ConfluenceBitData } from './ConfluenceBitData'
import { WebsiteBitData } from './WebsiteBitData'
import { DriveBitData } from './DriveBitData'
import { GithubBitData } from './GithubBitData'
import { GmailBitData } from './GmailBitData'
import { JiraBitData } from './JiraBitData'
import { SlackBitData } from './SlackBitData'
import { IntegrationType } from '../IntegrationType'
import { Bit } from '../Bit'

/**
 * What Bit.data property can be.
 */
export type BitData =
  | ConfluenceBitData
  | GithubBitData
  | GmailBitData
  | JiraBitData
  | SlackBitData
  | DriveBitData
  | WebsiteBitData

export type AllBitData = {
  github: GithubBitData
  slack: SlackBitData
  gmail: GmailBitData
  gdrive: DriveBitData
  website: WebsiteBitData
  confluence: ConfluenceBitData
  jira: JiraBitData
  app1: any
}

export type GenericBit<A extends IntegrationType> = Bit & {
  type: A
  data: AllBitData[A]
}
