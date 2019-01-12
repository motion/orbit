export enum AppType {
  home = 'home',
  search = 'search',
  people = 'people',
  topics = 'topics',
  lists = 'lists',
  sources = 'sources',
  bit = 'bit',
  settings = 'settings',
  message = 'message'
}

export type AppConfig = {
  title: string
  type: AppType
  id: string
  data?: any
  icon?: string
  iconLight?: string
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
