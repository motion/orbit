import { AppDefinition } from '@mcro/kit'
import { AppBit } from '@mcro/models'
import * as ConfluenceApp from './confluence/main'
import * as CustomApp from './custom/main'
import * as DriveApp from './drive/main'
import * as GithubApp from './github/main'
import * as GmailApp from './gmail/main'
import * as JiraApp from './jira/main'
import * as ListsApp from './lists/main'
import * as PeopleApp from './people/main'
import * as SearchApp from './search/main'
import * as SlackApp from './slack/main'
import * as WebsiteApp from './website/main'

type FullAppDefinition = {
  app: AppDefinition
  context?: React.Context<any>
  API?: {
    recieve(app: AppBit, parentID: number, child: any): any
  }
}

export const apps: FullAppDefinition[] = [
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
