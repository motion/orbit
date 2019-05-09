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
  /** Unique identifier for app bundle */
  id: string

  /** Name of app in app store */
  name: string

  /** SVG icon string of app */
  icon: string

  /** Optional light icon SVG */
  iconLight?: string

  /** Automatic display item contents by ItemType */
  itemType?: ItemType

  /** Main view of app */
  app?: FunctionComponent<AppProps<AppData>>

  /** Settings view of app */
  settings?: FunctionComponent<AppProps<AppData>>

  /** Define fields for use in setting up app or storing credentials */
  setup?: SetupFields

  /** Validate setup fields */
  setupValidate?: (
    app: AppBit<AppData>,
    values: Partial<AppData>,
  ) => FormErrors<FormErrors<SetupFields>> | Promise<FormErrors<SetupFields>>

  /** Define a syncer [TODO] allow oauth config here */
  sync?: boolean

  /** Define a public node API for app */
  api?: (app: AppBit<AppData>) => any

  /** Define a GraphQL API for app */
  graph?: (app: AppBit<AppData>) => any

  /** Extra configuration for apps */
  viewConfig?: {
    transparentBackground?: boolean
    acceptsSearch?: boolean
  }
}

export type AppBitMainProps = { item: Bit }

export type AppSettingsProps<T extends AppBit> = {
  appProps?: AppProps
  app: T
}

export type LazyAppDefinition = () => Promise<{ default: AppDefinition }>
