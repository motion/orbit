import { ConfluenceSourceValues } from './ConfluenceSourceValues'
import { WebsiteSourceValues } from './WebsiteSourceValues'
import { DriveSourceValues } from './DriveSourceValues'
import { GithubSourceValues } from './GithubSourceValues'
import { GmailSourceValues } from './GmailSourceValues'
import { JiraSourceValues } from './JiraSourceValues'
import { SlackSourceValues } from './SlackSourceValues'

export type SourceValues =
  | ConfluenceSourceValues
  | JiraSourceValues
  | DriveSourceValues
  | GmailSourceValues
  | GithubSourceValues
  | SlackSourceValues
  | WebsiteSourceValues
