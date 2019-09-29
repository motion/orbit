import React, { FunctionComponent } from 'react'

import { Button, ButtonProps } from './buttons/Button'
import { StackProps } from './View/Stack'

export type TabProps = Omit<StackProps, 'children'> & {
  /**
   * ID is used for onActive/Active of <Tabs /> (may also use `key`, thought that may be removed)
   */
  id?: string
  /**
   * Label of this tab to show in the tab list.
   */
  label?: any
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
  children?: React.ReactNode | FunctionComponent
  /**
   * Icon for tab
   */
  icon?: React.ReactNode
}

/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
export function Tab(_: TabProps) {
  console.error("don't render me", _)
  return null
}

export function TabItem(props: ButtonProps) {
  return (
    <Button
      ellipse
      minWidth="min-content"
      sizeHeight={0.8}
      sizeFont={0.85}
      sizeIcon={1.2}
      sizePadding={1.5}
      fontWeight={500}
      elevation={0}
      iconAfter={false}
      borderWidth={1}
      borderPosition="outside"
      {...props}
    />
  )
}
