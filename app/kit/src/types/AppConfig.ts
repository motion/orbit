import { SourceType } from '@mcro/models'

export type AppConfig = {
  appId?: string
  id?: string
  subId?: string
  title?: string
  data?: any
  icon?: string
  iconLight?: string
  source?: SourceType
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
