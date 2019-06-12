import { FormErrors, FormFieldsObj } from '@o/ui'
import { FunctionComponent } from 'react'

import { AppViewProps } from './AppViewProps'
import { AppWorker } from './AppWorker'
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

  /** Set default colors for the icon */
  iconColors?: string[]

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
  ) => FormErrors<FormErrors<SetupFields>> | Promise<FormErrors<SetupFields>>

  /** Define OAuth authentication */
  auth?: string

  /** Validate authentication and add anything you need to AppBit */
  finishAuth?: (
    app: AppBit<AppData>,
    authValues: any,
    oauthInfo: { credentials: { clientSecret: string; clientID: string; callbackURL?: string } },
  ) => Promise<AppBit<AppData>>

  /** Define a background process */
  workers?: AppWorker[]

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
