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

  settings?: {
    hasOnboarded?: boolean
    autoUpdate?: boolean
    autoLaunch?: boolean
    theme?: 'dark' | 'light' | 'automatic'
    vibrancy?: 'some' | 'more' | 'none'
    openShortcut?: string
    recentSearches?: string[]
    cosalIndexUpdatedTo?: number
    topicsIndexUpdatedTo?: number
    topTopics?: string[]
  }

  appState?: { [key: string]: any }
}
