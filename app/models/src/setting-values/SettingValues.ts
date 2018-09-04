import { ConfluenceSettingValues } from './ConfluenceSettingValues'
import { GDriveSettingValues } from './GDriveSettingValues'
import { GeneralSettingValues } from './GeneralSettingValues'
import { GithubSettingValues } from './GithubSettingValues'
import { GmailSettingValues } from './GmailSettingValues'
import { JiraSettingValues } from './JiraSettingValues'
import { SlackSettingValues } from './SlackSettingValues'

export type SettingValues =
  | GeneralSettingValues
  | ConfluenceSettingValues
  | JiraSettingValues
  | GDriveSettingValues
  | GmailSettingValues
  | GithubSettingValues
  | SlackSettingValues