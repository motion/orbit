import { Bit } from '../interfaces/Bit'
import { SourceType } from '../interfaces/SourceType'
import { ConfluenceBitData } from './ConfluenceBitData'
import { DriveBitData } from './DriveBitData'
import { GithubBitData } from './GithubBitData'
import { GmailBitData } from './GmailBitData'
import { JiraBitData } from './JiraBitData'
import { PinnedBitData } from './PinnedBitData'
import { SlackBitData } from './SlackBitData'
import { WebsiteBitData } from './WebsiteBitData'

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

export type GenericBit<A extends SourceType> = Bit & {
  type: A
  data: AllBitData[A]
}
