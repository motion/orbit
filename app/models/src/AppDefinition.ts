import { FormErrors, FormFieldsObj } from '@o/ui'
import { FunctionComponent } from 'react'

import { AppViewProps } from './AppViewProps'
import { AppBit } from './interfaces/AppBit'
import { ItemType } from './interfaces/ItemType'

export type AppDefinition<AppData = any, SetupFields extends FormFieldsObj = any> = {
  /** Unique identifier for app bundle */
  id: string

  /** Name of app in app store */
  name: string

  /** SVG icon string of app */
  icon: string

  /** Optional light icon SVG */
  iconLight?: string

  /** Description of app */
  description?: string

  /** Automatic display item contents by ItemType */
  itemType?: ItemType

  /** Main view of app */
  app?: FunctionComponent<AppViewProps<AppData>>

  /** Settings view of app */
  settings?: FunctionComponent<AppViewProps<AppData>>

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
