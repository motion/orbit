/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { attachTheme, gloss, Row, ThemeObject, View } from '@mcro/gloss'
import * as React from 'react'
import { Icon } from './Icon'
import { Text } from './Text'

const BORDER = '1px solid #dddfe2'

const Chevron = gloss(Icon, {
  marginRight: 4,
  marginLeft: -2,
  marginBottom: 1,
})

export type PanelProps = {
  className?: string

  /**
   * Whether this panel is floating from the rest of the UI. ie. if it has
   * margin and a border.
   */
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

  /**
   * Heading for this panel. If this is anything other than a string then no
   * padding is applied to the heading.
   */
  accessory?: React.ReactNode

  theme?: ThemeObject

  // how much the panel flexes when open
  flex?: number
}

type State = {
  collapsed: boolean
}

const PanelContainer = gloss().theme(props => ({
  padding: props.floating ? 10 : 0,
  borderBottom: props.collapsed ? 'none' : BORDER,
  flex: props.collapsed ? 'initial' : props.flex || 1,
}))

const PanelHeader = gloss(Row).theme(props => ({
  backgroundColor: '#f6f7f9',
  border: props.floating ? BORDER : 'none',
  // borderBottom: BORDER,
  borderTopLeftRadius: 2,
  borderTopRightRadius: 2,
  justifyContent: 'space-between',
  alignItems: 'center',
  fontWeight: 500,
  flexShrink: 0,
  padding: [3, 10],
  '&:not(:first-child)': {
    borderTop: BORDER,
  },
}))

const PanelBody = gloss().theme(props => ({
  backgroundColor: '#fff',
  border: props.floating ? BORDER : 'none',
  borderBottomLeftRadius: 2,
  borderBottomRightRadius: 2,
  borderTop: 'none',
  flexGrow: 1,
  padding: props.padded ? 10 : 0,
}))

@attachTheme
export class Panel extends React.Component<PanelProps, State> {
  static defaultProps = {
    stretch: false,
    floating: false,
    collapsable: false,
  }

  static PanelContainer = PanelContainer
  static PanelHeader = PanelHeader
  static PanelBody = PanelBody

  state = {
    collapsed: this.props.collapsed == null ? false : this.props.collapsed,
  }

  onClick = () => this.setState({ collapsed: !this.state.collapsed })

  render() {
    const {
      padded,
      children,
      className,
      stretch,
      floating,
      heading,
      collapsable,
      accessory,
      theme,
    } = this.props
    const { collapsed } = this.state
    return (
      <Panel.PanelContainer
        className={className}
        floating={floating}
        stretch={stretch}
        collapsed={collapsed}
      >
        <Panel.PanelHeader
          floating={floating}
          padded={typeof heading === 'string'}
          onClick={this.onClick}
        >
          {collapsable && (
            <Chevron
              // @ts-ignore
              color={theme.titleBar.icon}
              name={collapsed ? 'triangle-right' : 'triangle-down'}
              size={12}
            />
          )}
          <View flex={1}>
            <Text size={0.95}>{heading}</Text>
          </View>
          {accessory}
        </Panel.PanelHeader>

        {children == null || (collapsable && collapsed) ? null : (
          <Panel.PanelBody stretch={stretch} padded={padded} floating={floating}>
            {children}
          </Panel.PanelBody>
        )}
      </Panel.PanelContainer>
    )
  }
}
