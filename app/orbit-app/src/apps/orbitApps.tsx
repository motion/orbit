import { apps } from '@mcro/apps'
import { AppPackage } from '@mcro/kit'
import * as AppsApp from './apps/main'
import * as BitApp from './bit/main'
import * as CreateAppApp from './CreateAppApp'
import * as MessageApp from './MessageApp'
import * as OnboardApp from './onboard/main'
import * as SettingsApp from './settings/main'
import * as SourcesApp from './sources/main'
import * as SpacesApp from './spaces/main'

// TODO make these loadable dynamically
const appsWithId = apps.map(app => ({
  ...app,
  id: app.app.id || app.app.name.toLowerCase().replace(' ', '-'),
}))

export const orbitApps: AppPackage[] = [
  SettingsApp,
  SpacesApp,
  SourcesApp,
  AppsApp,
  BitApp,
  OnboardApp,
  CreateAppApp,
  MessageApp,
  ...appsWithId,
]
