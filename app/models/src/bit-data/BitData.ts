import { AppBitType } from '../interfaces/AppBit'
import { Bit } from '../interfaces/Bit'
import { ConfluenceBitData } from './ConfluenceBitData'
import { DriveBitData } from './DriveBitData'
import { GithubBitData } from './GithubBitData'
import { GmailBitData } from './GmailBitData'
import { JiraBitData } from './JiraBitData'
import { PersonData } from './PersonData'
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

export type GenericBit<A extends string> = A extends AppBitType
  ? Bit & {
      type: A
      data: AllBitData[A]
    }
  : any
