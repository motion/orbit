import { AppViews } from '@mcro/kit'
import React from 'react'
import AppsAppsIndex from './apps/AppsIndex'
import AppsAppsMain from './apps/AppsMain'
import { bit } from './bit'
import { createApp } from './createApp'
import OrbitOnboardMain from './onboard/OrbitOnboardMain'
import { MessageViewMain } from './views/MessageViewMain'

export const appsStatic: { [key: string]: AppViews } = {
  bit,
  apps: {
    main: AppsAppsMain,
    index: AppsAppsIndex,
  },
  onboard: {
    main: OrbitOnboardMain,
  },
  createApp,
  message: {
    main: props => <MessageViewMain {...props.appConfig} />,
    index: () => <div>empty main</div>,
  },
}
