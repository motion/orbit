import { AppBit, Bit, ItemType } from '@o/models'
import * as React from 'react'
import { FunctionComponent } from 'react'
import { AppProps } from './AppProps'

export type AppElements = {
  index?: React.ReactElement<any>
  children?: React.ReactElement<any>
  statusBar?: React.ReactElement<any>
  toolBar?: React.ReactElement<any>
  context?: any
}

export type AppViews = {
  index?: FunctionComponent<AppProps> | false | null
  main?: FunctionComponent<AppProps> | false | null
  toolBar?: FunctionComponent<AppProps> | false | null
  statusBar?: FunctionComponent<AppProps> | false | null
  settings?: FunctionComponent<AppProps> | false | null
  setup?: FunctionComponent<AppProps> | false | null
}

export type AppDefinition = {
  id: string
  name: string
  icon: string
  iconLight?: string
  context?: React.Context<any>
  itemType?: ItemType
  app?: FunctionComponent<AppProps>
  settings?: FunctionComponent<AppProps>
  setup?: FunctionComponent<AppProps>
  config?: {
    transparentBackground?: boolean
  }
  appData?: Object
  // TODO @umed this is where we can put syncer stuff
  sync?: {} // todo: it can be boolean at max
  API?: any // {
  //   receive(app: AppBit, parentID: number, child: any): any
  // }
}

export type AppBitMainProps = { item: Bit }

export type AppSettingsProps<T extends AppBit> = {
  appProps?: AppProps
  app: T
}
