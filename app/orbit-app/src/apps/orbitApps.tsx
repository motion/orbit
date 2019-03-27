import ConfluenceApp from '@o/confluence-app'
import CustomApp from '@o/custom-app'
import DriveApp from '@o/drive-app'
import GithubApp from '@o/github-app'
import GmailApp from '@o/gmail-app'
import JiraApp from '@o/jira-app'
import { AppDefinition, configureKit } from '@o/kit'
import ListsApp from '@o/lists-app'
import PeopleApp from '@o/people-app'
import PostgresApp from '@o/postgres-app'
import SearchApp from '@o/search-app'
import SlackApp from '@o/slack-app'
import WebsiteApp from '@o/website-app'
import { StoreContext } from '../contexts'
import { AppsApp } from './apps/AppsApp'
import { BitApp } from './bit/BitApp'
import { CreateApp } from './CreateAppApp'
import CustomApp2 from './custom/CustomApp'
import DataExplorerApp from './DataExplorerApp'
import { HomeApp } from './HomeApp'
import { MessageApp } from './MessageApp'
import { OnboardApp } from './onboard/OnboardApp'
import { SettingsApp } from './settings/SettingsApp'
import { SpacesApp } from './spaces/SpacesApp'

const apps: AppDefinition[] = [
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
  CustomApp2,
]

export const orbitStaticApps: AppDefinition[] = [
  DataExplorerApp,
  SettingsApp,
  SpacesApp,
  AppsApp,
  BitApp,
  OnboardApp,
  CreateApp,
  MessageApp,
  HomeApp,
  // get our "bit/source" apps for now...
  ...apps.filter(x => !x.app),
]

export const orbitApps: AppDefinition[] = [
  ...orbitStaticApps,
  // TODO figure this out
  ...apps.filter(x => !!x.app),
]

console.debug('orbitApps', orbitApps)

export function getApps() {
  return orbitApps
}

if (module['hot']) {
  module['hot'].addStatusHandler(status => {
    if (status === 'apply') {
      configureKit({
        StoreContext,
        getApps,
      })
    }
  })
}
