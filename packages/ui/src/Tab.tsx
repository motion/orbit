/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
export function Tab(_: {
  /**
   * Label of this tab to show in the tab list.
   */
  label: any
  /**
   * Whether this tab is closable.
   */
  closable?: boolean
  /**
   * Whether this tab is hidden. Useful for when you want a tab to be
   * inaccessible via the user but you want to manually set the `active` props
   * yourself.
   */
  hidden?: boolean
  /**
   * Whether this tab should always be included in the DOM and have it's
   * visibility toggled.
   */
  persist?: boolean
  /**
   * Callback for when tab is closed.
   */
  onClose?: () => void
}) {
  console.error("don't render me")
  return null
}
