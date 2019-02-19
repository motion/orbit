import { App, AppDefinition } from './AppTypes'
import { CustomApp } from './custom/CustomApp'
import { ListsApp } from './lists/ListsApp'
import { SearchApp } from './search/SearchApp'
import { SettingsApp } from './settings/SettingsApp'
import { SourcesApp } from './sources/SourcesApp'
import { SpacesApp } from './spaces/SpacesApp'

// TODO move them over to new, see ListsApp

type AppsIndex = {
  [key: string]:  // new
    | App<any>
    // legacy
    | AppDefinition
}

export const apps: AppsIndex = {
  search: SearchApp,
  lists: ListsApp,
  settings: SettingsApp,
  spaces: SpacesApp,
  sources: SourcesApp,
  custom: CustomApp,
}
