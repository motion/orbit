import ConfluenceApp from '@o/confluence-app'
import CustomApp from '@o/custom-app'
import DriveApp from '@o/drive-app'
import GithubApp from '@o/github-app'
import GmailApp from '@o/gmail-app'
import JiraApp from '@o/jira-app'
import { AppDefinition, configureKit, createApp } from '@o/kit'
import ListsApp from '@o/lists-app'
import PeopleApp from '@o/people-app'
import PostgresApp from '@o/postgres-app'
import SearchApp from '@o/search-app'
import SlackApp from '@o/slack-app'
import { Loading } from '@o/ui'
import WebsiteApp from '@o/website-app'
import { createElement } from 'react'

import { StoreContext } from '../StoreContext'
import AppsApp from './apps/AppsApp'
import BitApp from './bit/BitApp'
import CreateApp from './CreateAppApp'
import CustomApp2 from './custom/CustomApp'
import DataExplorerApp from './DataExplorerApp'
import HomeApp from './HomeApp'
import MessageApp from './MessageApp'
import OnboardApp from './onboard/OnboardApp'
import SettingsApp from './settings/SettingsApp'
import SpacesApp from './spaces/SpacesApp'

// "available" apps to install/use
// eventually can be in a dynamic app store service

const apps: AppDefinition[] = [
  ListsApp,
  SearchApp,
  PeopleApp,
  ConfluenceApp,
  JiraApp,
  GmailApp,
  DriveApp,
  GithubApp,
  SlackApp,
  WebsiteApp,
  PostgresApp,
  CustomApp2,
  CustomApp,
]

// apps we use internally in orbit

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
  createApp({
    name: 'Loading...',
    icon: '',
    id: 'loading',
    app: () => createElement(Loading),
  }),
]

export const orbitApps: AppDefinition[] = [...orbitStaticApps, ...apps]

export function getApps() {
  return orbitApps
}

if (module['hot']) {
  module['hot'].addStatusHandler(status => {
    // remove webpack bad compile message after hmr
    const iframe = document.querySelector('body > iframe')
    iframe && iframe.remove()

    if (status === 'apply') {
      configureKit({
        StoreContext,
        getApps,
      })
    }
  })
}
