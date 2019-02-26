import { apps } from '@mcro/apps'
import { AppDefinition } from '@mcro/kit'
import { AppsApp } from './apps/AppsApp'
import { BitApp } from './bit/BitApp'
import { CreateApp } from './CreateAppApp'
import { MessageApp } from './MessageApp'
import { OnboardApp } from './onboard/OnboardApp'
import { SettingsApp } from './settings/SettingsApp'
import { SpacesApp } from './spaces/SpacesApp'

export const orbitStaticApps: AppDefinition[] = [
  SettingsApp,
  SpacesApp,
  AppsApp,
  BitApp,
  OnboardApp,
  CreateApp,
  MessageApp,
  // get our "bit/source" apps for now...
  ...apps.filter(x => !x.app),
]

export const orbitApps: AppDefinition[] = [
  ...orbitStaticApps,
  // TODO figure this out
  ...apps.filter(x => !!x.app),
]
