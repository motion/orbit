/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { gloss, Row, ThemeObject, View, ViewProps } from '@mcro/gloss'
import React, { useEffect, useState } from 'react'
import { Icon } from './Icon'
import { Text } from './text/Text'

const Chevron = gloss(Icon, {
  marginRight: 4,
  marginLeft: -2,
  marginBottom: 1,
}).theme(theme => ({
  color: theme.iconColor || theme.color,
}))

export type PanelProps = {
  // whether to position above content
  floating?: boolean

  /**
   * Whether the panel takes up all the space it can. Equivalent to the following CSS:
   *
   *  height: 100%;
   *  width: 100%;
   */
  stretch?: boolean

  /**
   * Heading for this panel. If this is anything other than a string then no
   * padding is applied to the heading.
   */
  heading: React.ReactNode

  /**
   * Contents of the panel.
   */
  children?: React.ReactNode

  /**
   * Whether the panel header and body have padding.
   */
  padded?: boolean

  /**
   * Whether the panel can be collapsed
   */
  collapsable?: boolean

  /**
   * Initial state for panel if it is collapsable
   */
  collapsed?: boolean

  // callback on collapse change
  onCollapse?: (next?: boolean) => any

  /**
   * Heading for this panel. If this is anything other than a string then no
   * padding is applied to the heading.
   */
  accessory?: React.ReactNode

  theme?: ThemeObject

  // how much the panel flexes when open
  openFlex?: number
} & ViewProps

const PanelContainer = gloss(View).theme((props, theme) => ({
  borderBottom: props.collapsed ? 'none' : [1, theme.sidebarBorderColor || theme.borderColor],
  flex: props.collapsed ? 'initial' : props.openFlex || 1,
  ...(props.floating && {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  }),
}))

const PanelHeader = gloss(Row, {
  borderTopLeftRadius: 2,
  borderTopRightRadius: 2,
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 500,
  flexShrink: 0,
  padding: [3, 10],
}).theme((_, theme) => ({
  backgroundColor: theme.panelHeaderBackground || theme.background,
  '&:not(:first-child)': {
    borderTop: [1, theme.sidebarBorderColor || theme.borderColor],
  },
}))

const PanelBody = gloss({
  borderBottomLeftRadius: 2,
  borderBottomRightRadius: 2,
  borderTop: 'none',
  flex: 1,
  overflow: 'hidden',
}).theme((props, theme) => ({
  backgroundColor: theme.background,
  padding: props.padded ? 10 : 0,
}))

export function Panel(props: PanelProps) {
  const {
    padded,
    children,
    className,
    stretch = false,
    heading,
    collapsable = false,
    accessory,
    theme,
    floating = false,
    onCollapse,
    ...restProps
  } = props
  const [collapsed, setCollapsed] = useState(true)

  useEffect(
    () => {
      if (typeof restProps.collapsed === 'boolean') {
        setCollapsed(restProps.collapsed)
      }
    },
    [restProps.collapsed],
  )

  const onClick = () => {
    const next = !collapsed
    setCollapsed(next)
    if (onCollapse) {
      onCollapse(next)
    }
  }

  return (
    <PanelContainer
      className={className}
      stretch={stretch}
      collapsed={collapsed}
      floating={floating}
      {...restProps}
    >
      <PanelHeader padded={typeof heading === 'string'} onClick={onClick}>
        {collapsable && <Chevron name={collapsed ? 'triangle-right' : 'triangle-down'} size={12} />}
        <View flex={1}>
          <Text size={0.9} alpha={0.65}>
            {heading}
          </Text>
        </View>
        {accessory}
      </PanelHeader>

      {children == null || (collapsable && collapsed) ? null : (
        <PanelBody stretch={stretch} padded={padded}>
          {children}
        </PanelBody>
      )}
    </PanelContainer>
  )
}
