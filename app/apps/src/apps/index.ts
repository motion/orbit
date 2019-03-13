import { AppDefinition } from '@o/kit'
import ConfluenceApp from '@o/confluence-app'
import CustomApp from './custom'
import DriveApp from '@o/drive-app'
import GithubApp from '@o/github-app'
import GmailApp from '@o/gmail-app'
import JiraApp from '@o/jira-app'
import ListsApp from './lists'
import PeopleApp from './people'
import SearchApp from './search-app'
import SlackApp from '@o/slack-app'
import WebsiteApp from '@o/website-app'
import PostgresApp from '@o/postgres-app'

export const apps: AppDefinition[] = [
  ListsApp,
  SearchApp,
  PeopleApp,
  CustomApp,
  ConfluenceApp,
  JiraApp,
  GmailApp,
  DriveApp,
  GithubApp,
  SlackApp,
  WebsiteApp,
  PostgresApp,
]
