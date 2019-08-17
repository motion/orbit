export interface Setting {
  /**
   * Setting id.
   */
  id?: number

  /**
   * Setting name.
   */
  name?: string

  /**
   * Setting email.
   */
  value?: {
    cosalIndexUpdatedTo?: number
    topicsIndexUpdatedTo?: number
  }
}
