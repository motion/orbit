import { AppType } from '@mcro/models'
import * as React from 'react'
import { GenericComponent } from '../types'
import { AppProps } from './AppProps'
import { apps as appsApps } from './apps/index'
import { bit } from './bit'
import { createApp } from './createApp'
import { lists } from './lists'
import { onboard } from './onboard'
import { people } from './people/people'
import { search } from './search'
import { settings } from './settings'
import { sources } from './sources'
import { topics } from './topics'
import { MessageViewMain } from './views/MessageViewMain'

type App = {
  index?: GenericComponent<AppProps<any>>
  main?: GenericComponent<AppProps<any>>
}

type AppsIndex = { [key in AppType]: App }

export const apps: AppsIndex = {
  search,
  people,
  topics,
  lists,
  sources,
  settings,
  bit,
  apps: appsApps,
  onboard,
  createApp,
  message: {
    main: props => <MessageViewMain {...props.appConfig} />,
    index: () => <div>empty main</div>,
  },
}
