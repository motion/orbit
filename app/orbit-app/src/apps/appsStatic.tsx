import React from 'react'
import AppsAppsMain from './apps/AppsMain'
import { AppViews } from './AppTypes'
import { bit } from './bit'
import { createApp } from './createApp'
import { custom } from './custom/custom'
import OrbitOnboardMain from './onboard/OrbitOnboardMain'
import { people } from './people/people'
import { MessageViewMain } from './views/MessageViewMain'

export const appsStatic: { [key: string]: AppViews } = {
  people,
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
