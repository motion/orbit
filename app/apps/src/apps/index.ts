import { AppModule } from '@mcro/kit';
import * as ConfluenceApp from './confluence/main';
import * as CustomApp from './custom/main';
import * as DriveApp from './drive/main';
import * as GithubApp from './github/main';
import * as GmailApp from './gmail/main';
import * as JiraApp from './jira/main';
import * as ListsApp from './lists/main';
import * as PeopleApp from './people/main';
import * as SearchApp from './search/main';
import * as SlackApp from './slack/main';
import * as WebsiteApp from './website/main';

export const apps: AppModule[] = [
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
