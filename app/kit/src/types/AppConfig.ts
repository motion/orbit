export type AppConfig = {
  identifier?: string
  id?: string
  subId?: string
  title?: string
  data?: any
  icon?: string
  iconLight?: string
  subType?: string
  viewType?: 'main' | 'index' | 'setup' | 'settings'
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
