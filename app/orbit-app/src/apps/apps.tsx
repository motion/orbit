import { AppType } from '@mcro/models'
import * as React from 'react'
import { apps as appsApps } from './apps/index'
import { AppDefinition } from './AppTypes'
import { bit } from './bit'
import { createApp } from './createApp'
import { custom } from './custom/custom'
import { ListsApp } from './lists/ListsApp'
import { onboard } from './onboard'
import { people } from './people/people'
import { search } from './search'
import { settings } from './settings'
import { sources } from './sources'
import { spaces } from './spaces'
import { topics } from './topics'
import { MessageViewMain } from './views/MessageViewMain'

type AppsIndex = { [key in AppType]: AppDefinition }

export const apps: AppsIndex = {
  spaces,
  search,
  people,
  topics,
  lists: ListsApp,
  sources,
  settings,
  bit,
  apps: appsApps,
  onboard,
  createApp,
  custom,
  message: {
    main: props => <MessageViewMain {...props.appConfig} />,
    index: () => <div>empty main</div>,
  },
}
