import { AppDefinition } from '@mcro/kit'
import ConfluenceApp from './confluence'
import CustomApp from './custom'
import DriveApp from './drive'
import GithubApp from './github'
import GmailApp from './gmail'
import JiraApp from './jira'
import ListsApp from './lists'
import PeopleApp from './people'
import SearchApp from './search'
import SlackApp from './slack'
import WebsiteApp from './website'

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
]
