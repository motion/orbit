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
   * Data stored on this row
   * We wrap it in { dataValue: any } because it can't be null in SQLite
   * So we ensure there's always an object
   */
  data?: { dataValue: any }
}
