import { AppModuleExported } from '@mcro/kit'
import * as AppsApp from './apps/main'
import * as BitApp from './bit/main'
import * as CreateAppApp from './CreateAppApp'
import * as MessageApp from './MessageApp'
import * as OnboardApp from './onboard/main'
import * as SettingsApp from './settings/main'
import * as SourcesApp from './sources/main'
import * as SpacesApp from './spaces/main'

export const orbitApps: AppModuleExported[] = [
  SettingsApp,
  SpacesApp,
  SourcesApp,
  AppsApp,
  BitApp,
  OnboardApp,
  CreateAppApp,
  MessageApp,
]
