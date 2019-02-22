import { AppFnDefinition } from '@mcro/kit'
import { SettingsApp } from './settings/SettingsApp'
import { SourcesApp } from './sources/SourcesApp'
import { SpacesApp } from './spaces/SpacesApp'

// TODO move them over to new, see ListsApp

type AppsIndex = {
  [key: string]: AppFnDefinition
}

export const apps: AppsIndex = {
  settings: SettingsApp,
  spaces: SpacesApp,
  sources: SourcesApp,
}
