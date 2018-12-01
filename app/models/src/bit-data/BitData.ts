import { ConfluenceBitData } from './ConfluenceBitData'
import { PinnedBitData } from './PinnedBitData'
import { WebsiteBitData } from './WebsiteBitData'
import { DriveBitData } from './DriveBitData'
import { GithubBitData } from './GithubBitData'
import { GmailBitData } from './GmailBitData'
import { JiraBitData } from './JiraBitData'
import { SlackBitData } from './SlackBitData'
import { IntegrationType } from '../interfaces/IntegrationType'
import { Bit } from '../interfaces/Bit'

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
  | PinnedBitData

export type AllBitData = {
  github: GithubBitData
  slack: SlackBitData
  gmail: GmailBitData
  drive: DriveBitData
  website: WebsiteBitData
  confluence: ConfluenceBitData
  jira: JiraBitData
  pinned: PinnedBitData
}

export type GenericBit<A extends IntegrationType> = Bit & {
  type: A
  data: AllBitData[A]
}
