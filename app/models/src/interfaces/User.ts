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
      activePaneIndex: number
    }
  }

  settings?: {
    hasOnboarded?: boolean
    autoUpdate?: boolean
    autoLaunch?: boolean
    theme?: 'dark' | 'light' | 'automatic'
    openShortcut?: string
    recentSearches?: string[]
  }
}
