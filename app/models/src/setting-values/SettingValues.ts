import { ConfluenceSettingValues } from './ConfluenceSettingValues'
import { WebsiteSettingValues } from './WebsiteSettingValues'
import { DriveSettingValues } from './DriveSettingValues'
import { GeneralSettingValues } from './GeneralSettingValues'
import { GithubSettingValues } from './GithubSettingValues'
import { GmailSettingValues } from './GmailSettingValues'
import { JiraSettingValues } from './JiraSettingValues'
import { SlackSettingValues } from './SlackSettingValues'

export type SettingValues =
  | GeneralSettingValues
  | ConfluenceSettingValues
  | JiraSettingValues
  | DriveSettingValues
  | GmailSettingValues
  | GithubSettingValues
  | SlackSettingValues
  | WebsiteSettingValues