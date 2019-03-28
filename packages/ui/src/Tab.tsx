import React from 'react'
import { Button, ButtonProps } from './buttons/Button'

/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
export function Tab(_: {
  /**
   * ID is used for onActive/Active of <Tabs />
   */
  id: string
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
  /**
   * Children shows inside the tab content
   * Use a function to render the view only when tab is active
   */
  children?: React.ReactNode | (() => React.ReactNode)
  /**
   * Icon for tab
   */
  icon?: React.ReactNode
}) {
  console.error("don't render me")
  return null
}

export function TabItem(props: ButtonProps) {
  return (
    <Button
      ellipse
      spacing="min-content"
      minWidth="min-content"
      maxWidth={200}
      sizeHeight={0.8}
      sizeFont={0.9}
      sizeIcon={1.2}
      fontWeight={500}
      flex={typeof props.width === 'number' ? 'none' : 'inherit'}
      {...props}
    />
  )
}
