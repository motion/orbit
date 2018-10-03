export type AppConfig = {
  id: string
  icon: string
  title: string
  type: string
  integration: string
  subType?: string
  // allow various things to be passed as config
  // to help configure the peek window
  config?: {
    showTitleBar?: boolean
    viewPane?: string
    dimensions?: [number, number]
    // for auto measuring peek size
    contentSize?: number
    initialState: { [key: string]: any }
  }
}
