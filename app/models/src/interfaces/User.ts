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
}
