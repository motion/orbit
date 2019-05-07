import { AppBit, Bit, ItemType } from '@o/models'
import { FormErrors, FormFieldsObj } from '@o/ui'
import * as React from 'react'
import { FunctionComponent } from 'react'

import { AppProps } from './AppProps'

export type AppElements = {
  index?: React.ReactElement<any>
  children?: React.ReactNode
  statusBar?: React.ReactElement<any>
  toolBar?: React.ReactElement<any>
  context?: any
  actions?: React.ReactElement<any>
}

export type AppDefinition<AppData = any, SetupFields extends FormFieldsObj = any> = {
  id: string
  name: string
  icon: string
  iconLight?: string
  context?: React.Context<any>
  itemType?: ItemType
  app?: FunctionComponent<AppProps<AppData>>
  setup?: SetupFields
  setupValidate?: (
    app: AppBit<AppData>,
  ) => FormErrors<FormErrors<SetupFields>> | Promise<FormErrors<SetupFields>>
  settings?: FunctionComponent<AppProps<AppData>>
  sync?: boolean
  api?: (app: AppBit<AppData>) => any
  graph?: (app: AppBit<AppData>) => any
  viewConfig?: {
    transparentBackground?: boolean
  }
}

export type AppBitMainProps = { item: Bit }

export type AppSettingsProps<T extends AppBit> = {
  appProps?: AppProps
  app: T
}

export type LazyAppDefinition = () => Promise<{ default: AppDefinition }>
