import { AppBit, ItemType } from '@o/models'
import { SearchBarType } from '@o/ui'
import * as React from 'react'
import { FunctionComponent } from 'react'
import { AppMainProps } from './AppMainProps'
import { OrbitItemViewProps } from './OrbitItemViewProps'

export type AppElements = {
  index?: React.ReactElement<any>
  children?: React.ReactElement<any>
  statusBar?: React.ReactElement<any>
  toolBar?: React.ReactElement<any>
  context?: any
}

export type AppViews = {
  index?: FunctionComponent<AppMainProps> | false | null
  main?: FunctionComponent<AppMainProps> | false | null
  toolBar?: FunctionComponent<AppMainProps> | false | null
  statusBar?: FunctionComponent<AppMainProps> | false | null
  settings?: FunctionComponent<AppMainProps> | false | null
  setup?: FunctionComponent<AppMainProps> | false | null
}

export type AppDefinition = {
  id: string
  name: string
  icon: string
  iconLight?: string
  context?: React.Context<any>
  itemType?: ItemType
  app?: FunctionComponent<AppMainProps>
  settings?: FunctionComponent<AppMainProps>
  setup?: FunctionComponent<AppMainProps>
  appData?: Object
  // TODO @umed this is where we can put syncer stuff
  sync?: {} // todo: it can be boolean at max
  API?: {
    receive(app: AppBit, parentID: number, child: any): any
  }
}

export type AppBitMainProps = OrbitItemViewProps & {
  searchBar: SearchBarType
  searchTerm: string
}

export type AppSettingsProps<T extends AppBit> = {
  appConfig?: AppMainProps
  app: T
}
