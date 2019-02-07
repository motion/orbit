import { IntegrationType } from './IntegrationType'

export enum AppType {
  search = 'search',
  people = 'people',
  topics = 'topics',
  lists = 'lists',
  sources = 'sources',
  bit = 'bit',
  settings = 'settings',
  message = 'message',
  apps = 'apps',
  createApp = 'createApp',
  onboard = 'onboard',
  custom = 'custom',
  spaces = 'spaces',
}

export type AppConfig = {
  id?: string
  subId?: string
  title?: string
  type?: AppType
  data?: any
  icon?: string
  iconLight?: string
  integration?: IntegrationType
  subType?: string
  viewType?: 'main' | 'index' | 'setup'
  // allow various things to be passed as config
  // to help configure the peek window
  viewConfig?: {
    showTitleBar?: boolean
    viewPane?: string
    dimensions?: [number, number]
    // for auto measuring peek size
    contentSize?: number
    initialState?: { [key: string]: any }
  }
}
