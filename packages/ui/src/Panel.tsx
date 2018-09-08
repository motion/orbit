/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import * as React from 'react'
import { Icon } from './Icon'
import { view } from '@mcro/black'
import { attachTheme, ThemeObject } from '@mcro/gloss'

const BORDER = '1px solid #dddfe2'

const Chevron = view(Icon, {
  marginRight: 4,
  marginLeft: -2,
  marginBottom: 1,
})

type Props = {
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
  fill?: boolean
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
   * Whether the panel can be collapsed. Defaults to true
   */
  collapsable: boolean
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
}

type State = {
  collapsed: boolean
}

const PanelContainer = view({})
PanelContainer.theme = props => ({
  flexShrink: 0,
  padding: props.floating ? 10 : 0,
  borderBottom: props.collapsed ? 'none' : BORDER,
})

const PanelHeader = view({})
PanelHeader.theme = props => ({
  backgroundColor: '#f6f7f9',
  border: props.floating ? BORDER : 'none',
  borderBottom: BORDER,
  borderTopLeftRadius: 2,
  borderTopRightRadius: 2,
  justifyContent: 'space-between',
  lineHeight: '27px',
  fontWeight: 500,
  flexShrink: 0,
  padding: props.padded ? '0 10px' : 0,
  '&:not(:first-child)': {
    borderTop: BORDER,
  },
})

const PanelBody = view({})
PanelBody.theme = props => ({
  backgroundColor: '#fff',
  border: props.floating ? BORDER : 'none',
  borderBottomLeftRadius: 2,
  borderBottomRightRadius: 2,
  borderTop: 'none',
  flexGrow: 1,
  padding: props.padded ? 10 : 0,
})

@attachTheme
export class Panel extends React.Component<Props, State> {
  static defaultProps = {
    fill: false,
    floating: true,
    collapsable: true,
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
      fill,
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
        fill={fill}
        collapsed={collapsed}
      >
        <Panel.PanelHeader
          floating={floating}
          padded={typeof heading === 'string'}
          onClick={this.onClick}
        >
          <span>
            {collapsable && (
              <Chevron
                // @ts-ignore
                color={theme.titleBar.icon}
                name={collapsed ? 'triangle-right' : 'triangle-down'}
                size={12}
              />
            )}
            {heading}
          </span>
          {accessory}
        </Panel.PanelHeader>

        {children == null || (collapsable && collapsed) ? null : (
          <Panel.PanelBody
            fill={fill}
            padded={padded == null ? true : padded}
            floating={floating}
          >
            {children}
          </Panel.PanelBody>
        )}
      </Panel.PanelContainer>
    )
  }
}
