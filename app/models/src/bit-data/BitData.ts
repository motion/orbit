import { ConfluenceBitData } from './ConfluenceBitData'
import { GDriveBitData } from './GDriveBitData'
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
  | GDriveBitData
