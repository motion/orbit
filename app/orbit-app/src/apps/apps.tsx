import * as React from 'react';
import AppsAppsMain from './apps/AppsMain';
import { App, AppDefinition } from './AppTypes';
import { bit } from './bit';
import { createApp } from './createApp';
import { custom } from './custom/custom';
import { ListsApp } from './lists/ListsApp';
import OrbitOnboardMain from './onboard/OrbitOnboardMain';
import { people } from './people/people';
import { SearchApp } from './search/SearchApp';
import { SettingsApp } from './settings/SettingsApp';
import { SourcesApp } from './sources/SourcesApp';
import { SpacesApp } from './spaces/SpacesApp';
import { MessageViewMain } from './views/MessageViewMain';

// TODO move them over to new, see ListsApp

type AppsIndex = {
  [key: string]:
    // new
    | App<any>
    // legacy
    | AppDefinition
}

export const apps: AppsIndex = {
  spaces: SpacesApp,
  search: SearchApp,
  people,
  lists: ListsApp,
  sources: SourcesApp,
  settings: SettingsApp,
  bit,
  apps: {
    main: AppsAppsMain,
  },
  onboard: {
    main: OrbitOnboardMain,
  },
  createApp,
  custom,
  message: {
    main: props => <MessageViewMain {...props.appConfig} />,
    index: () => <div>empty main</div>,
  },
}
