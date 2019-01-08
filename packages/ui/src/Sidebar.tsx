/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { Interactive } from './Interactive'
import { Col } from './blocks/Col'
import * as React from 'react'
import { gloss } from '@mcro/gloss'

const SidebarInteractiveContainer = gloss(Interactive, {
  flex: 'none',
})

type SidebarPosition = 'left' | 'top' | 'right' | 'bottom'

type SidebarProps = {
  /**
   * Position of the sidebar.
   */
  position: SidebarPosition

  /**
   * Default width of the sidebar.  Only used for left/right sidebars.
   */
  width?: number
  /**
   * Minimum sidebar width. Only used for left/right sidebars.
   */
  minWidth?: number
  /**
   * Maximum sidebar width. Only used for left/right sidebars.
   */
  maxWidth?: number

  /**
   * Default height of the sidebar.
   */
  height?: number
  /**
   * Minimum sidebar height. Only used for top/bottom sidebars.
   */
  minHeight?: number
  /**
   * Maximum sidebar height. Only used for top/bottom sidebars.
   */
  maxHeight?: number

  /**
   * Background color.
   */
  backgroundColor?: string
  /**
   * Callback when the sidebar size ahs changed.
   */
  onResize?: (width: number, height?: number, desiredWidth?: number) => void
  /**
   * Contents of the sidebar.
   */
  children?: React.ReactNode
  /**
   * Class name to customise styling.
   */
  className?: string
}

type SidebarState = {
  width?: number
  height?: number
  userChange: boolean
}

export class Sidebar extends React.Component<SidebarProps, SidebarState> {
  static defaultProps = {
    position: 'left',
  }

  state = {
    userChange: false,
    width: this.props.width,
    height: this.props.height,
  }

  static getDerivedStateFromProps(props: SidebarProps, state: SidebarState) {
    if (!state.userChange && (state.width !== props.width || state.height !== props.height)) {
      return { width: props.width, height: props.height }
    }
    return null
  }

  onResize = (width: number, height: number, desiredWidth: number) => {
    const { onResize } = this.props
    if (onResize) {
      onResize(width, height, desiredWidth)
    } else {
      this.setState({ userChange: true, width, height })
    }
  }

  render() {
    const { backgroundColor, onResize, position, children } = this.props
    let height, minHeight, maxHeight, width, minWidth, maxWidth

    const resizable: { [key: string]: boolean } = {}
    if (position === 'left') {
      resizable.right = true
      ;({ width, minWidth, maxWidth } = this.props)
    } else if (position === 'top') {
      resizable.bottom = true
      ;({ height, minHeight, maxHeight } = this.props)
    } else if (position === 'right') {
      resizable.left = true
      ;({ width, minWidth, maxWidth } = this.props)
    } else if (position === 'bottom') {
      resizable.top = true
      ;({ height, minHeight, maxHeight } = this.props)
    }

    const horizontal = position === 'left' || position === 'right'

    if (horizontal) {
      width = width == null ? 200 : width
      minWidth = minWidth == null ? 100 : minWidth
      maxWidth = maxWidth == null ? 600 : maxWidth
    } else {
      height = height == null ? 200 : height
      minHeight = minHeight == null ? 100 : minHeight
      maxHeight = maxHeight == null ? 600 : maxHeight
    }

    console.log('render with', this.state.width, width)

    return (
      <SidebarInteractiveContainer
        className={this.props.className}
        minWidth={minWidth}
        maxWidth={maxWidth}
        width={horizontal ? (onResize ? width : this.state.width) : undefined}
        minHeight={minHeight}
        maxHeight={maxHeight}
        height={!horizontal ? (onResize ? height : this.state.height) : undefined}
        resizable={resizable}
        onResize={this.onResize}
      >
        <SidebarContainer position={position} backgroundColor={backgroundColor}>
          {children}
        </SidebarContainer>
      </SidebarInteractiveContainer>
    )
  }
}

const SidebarContainer = gloss(Col, {
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
}).theme((props, theme) => {
  const borderColor = theme.sidebarBorderColor || theme.borderColor
  return {
    background: props.background || theme.sidebarBackground || theme.background.alpha(0.5),
    borderLeft: props.position === 'right' ? `1px solid ${borderColor}` : 'none',
    borderTop: props.position === 'bottom' ? `1px solid ${borderColor}` : 'none',
    borderRight: props.position === 'left' ? `1px solid ${borderColor}` : 'none',
    borderBottom: props.position === 'top' ? `1px solid ${borderColor}` : 'none',
    textOverflow: props.overflow ? 'ellipsis' : 'auto',
    whiteSpace: props.overflow ? 'nowrap' : 'normal',
  }
})
