import { AppDefinition } from '@mcro/kit'
import { default as ConfluenceApp } from './confluence'
import { default as CustomApp } from './custom'
import { default as DriveApp } from './drive'
import { default as GithubApp } from './github'
import { default as GmailApp } from './gmail'
import { default as JiraApp } from './jira'
import { default as ListsApp } from './lists'
import { default as PeopleApp } from './people'
import { default as SearchApp } from './search'
import { default as SlackApp } from './slack'
import { default as WebsiteApp } from './website'

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
