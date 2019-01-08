export type AppType =
  | 'home'
  | 'search'
  | 'people'
  | 'topics'
  | 'lists'
  | 'sources'
  | 'bit'
  | 'settings'

export type AppConfig = {
  type: AppType
  id: string
  icon?: string
  iconLight?: string
  title: string
  integration?: string
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
