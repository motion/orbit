import { AppBit, Bit } from '@o/models'
import { AppDefinition } from '@o/orbit-types'
import * as React from 'react'

import { AppProps } from './AppProps'

export { AppDefinition } from '@o/orbit-types'

export type AppElements = {
  index?: React.ReactElement<any>
  children?: React.ReactNode
  statusBar?: React.ReactElement<any>
  toolBar?: React.ReactElement<any>
  context?: any
  actions?: React.ReactElement<any>
}

export type AppBitMainProps = { item: Bit }

export type AppSettingsProps<T extends AppBit> = {
  appProps?: AppProps
  app: T
}

export type LazyAppDefinition = () => Promise<{ default: AppDefinition }>
