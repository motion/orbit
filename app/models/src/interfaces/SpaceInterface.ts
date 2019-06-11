export interface Space {
  /**
   * Space id.
   */
  id?: number

  /**
   * Space name.
   */
  name?: string

  /**
   * Colors selected for the space icon.
   */
  colors?: string[]

  /**
   * Pane sort order.
   */
  paneSort?: number[]

  /**
   * Unique identifier used on filesystem to match to model.
   * For now match it to the package.json.name
   */
  identifier?: string

  /**
   * Local path on filesystem.
   */
  directory?: string

  /**
   * Whether to show onboarding.
   */
  onboarded?: boolean
}
