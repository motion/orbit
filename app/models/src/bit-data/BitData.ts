import { ConfluenceBitData } from './ConfluenceBitData'
import { WebsiteBitData } from './WebsiteBitData'
import { DriveBitData } from './DriveBitData'
import { GithubBitData } from './GithubBitData'
import { GmailBitData } from './GmailBitData'
import { JiraBitData } from './JiraBitData'
import { SlackBitData } from './SlackBitData'

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
