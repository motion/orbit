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

export const orbitStaticApps: AppPackage[] = [
  SettingsApp,
  SpacesApp,
  SourcesApp,
  AppsApp,
  BitApp,
  OnboardApp,
  CreateAppApp,
  MessageApp,
]

export const orbitApps: AppPackage[] = [...orbitStaticApps, ...apps]
