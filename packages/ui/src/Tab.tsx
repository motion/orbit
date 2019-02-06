import { gloss, Row, ViewProps } from '@mcro/gloss'
import React from 'react'
import { useBreadcrumb } from './Breadcrumbs'
import { getSegmentRadius } from './SegmentedRow'

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

export function TabItem(props: ViewProps) {
  const crumbs = useBreadcrumb()
  const segmentedProps =
    crumbs &&
    getSegmentRadius(
      { borderRadius: typeof props.borderRadius === 'number' ? props.borderRadius : 100 },
      crumbs,
    )
  return <TabItemChrome {...segmentedProps} {...props} />
}

const TabItemChrome = gloss(Row, {
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 22,
  alignItems: 'center',
  overflow: 'hidden',
  padding: [1, 10],
  position: 'relative',
  height: '100%',
  justifyContent: 'center',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  userSelect: 'none',
}).theme(({ active, width }, theme) => {
  const background = active
    ? theme.tabBackgroundActive || theme.backgroundActive
    : theme.tabBackground || theme.background
  return {
    width,
    flex: typeof width === 'number' ? 'none' : 1,
    color: active ? theme.colorActive : theme.colorBlur,
    background,
    '&:hover': {
      background: active ? background : theme.tabBackgroundHover,
      transition: active ? 'none' : 'all ease 400ms',
    },
  }
})
