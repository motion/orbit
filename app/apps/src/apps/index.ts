import { AppDefinition } from '@mcro/kit'
import { ConfluenceApp } from './confluence/ConfluenceApp'
import { CustomApp } from './custom/CustomApp'
import { DriveApp } from './drive/DriveApp'
import { GithubApp } from './github/GithubApp'
import { GmailApp } from './gmail/GmailApp'
import { JiraApp } from './jira/JiraApp'
import { ListsApp } from './lists/ListsApp'
import { PeopleApp } from './people/PeopleApp'
import { SearchApp } from './search/SearchApp'
import { SlackApp } from './slack/SlackApp'
import { WebsiteApp } from './website/WebsiteApp'

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
