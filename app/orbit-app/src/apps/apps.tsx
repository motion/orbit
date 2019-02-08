import * as React from 'react'
import AppsAppsMain from './apps/AppsMain'
import { AppDefinition } from './AppTypes'
import { bit } from './bit'
import { createApp } from './createApp'
import { custom } from './custom/custom'
import { ListsApp } from './lists/ListsApp'
import OrbitOnboardMain from './onboard/OrbitOnboardMain'
import { people } from './people/people'
import { search } from './search'
import { settings } from './settings'
import { sources } from './sources'
import { spaces } from './spaces'
import { MessageViewMain } from './views/MessageViewMain'

type AppsIndex = { [key: string]: AppDefinition }

export const apps: AppsIndex = {
  spaces,
  search,
  people,
  lists: ListsApp,
  sources,
  settings,
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
