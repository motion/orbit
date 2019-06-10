export interface State {
  /**
   * State id.
   */
  id?: number

  /**
   * Unique pathkey.
   */
  identifier?: string

  /**
   * Allow filtering by type
   */
  type?: string

  /**
   * User email.
   */
  data?: { [key: string]: any }
}
