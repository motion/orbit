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
import { PersonData } from '..'

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
  | PersonData

export type AllBitData = {
  github: GithubBitData
  slack: SlackBitData
  gmail: GmailBitData
  drive: DriveBitData
  website: WebsiteBitData
  confluence: ConfluenceBitData
  jira: JiraBitData
  pinned: PinnedBitData
  person: PersonData
}

export type GenericBit<A extends SourceType> = Bit & {
  type: A
  data: AllBitData[A]
}
