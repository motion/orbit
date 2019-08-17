export interface UserSettings {
  hasOnboarded?: boolean
  autoUpdate?: boolean
  autoLaunch?: boolean
  theme?: 'dark' | 'light' | 'automatic'
  vibrancy?: 'some' | 'more' | 'none'
  openShortcut?: string
  recentSearches?: string[]
}

export interface User {
  /**
   * User id.
   */
  id?: number

  /**
   * User name.
   */
  name?: string

  /**
   * User email.
   */
  email?: string

  /**
   * User id in the cloud.
   */
  cloudId?: string

  /**
   * Time when cloud sync was made last time.
   */
  lastTimeSync?: number

  /**
   * active space id
   */
  activeSpace?: number

  /**
   * spaceConfig
   */
  spaceConfig?: {
    //
    [spaceId: number]: {
      // nate: i removed this for now its very low priority (remembre which tab you were on)
      // and until we get useModel pretty optimized we can just do it in memory see OrbitWindowStore
      activePaneIndex: number
    }
  }

  settings?: UserSettings

  appState?: { [key: string]: any }
}
