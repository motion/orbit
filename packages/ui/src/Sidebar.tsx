/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { gloss } from '@mcro/gloss'
import * as React from 'react'
import { BorderBottom, BorderLeft, BorderRight, BorderTop } from './Border'
import { Interactive } from './Interactive'

const SidebarInteractiveContainer = gloss(Interactive, {
  flex: 'none',
})

const borderByPosition = {
  left: <BorderRight />,
  right: <BorderLeft />,
  top: <BorderBottom />,
  bottom: <BorderTop />,
}

type SidebarPosition = 'left' | 'top' | 'right' | 'bottom'

type SidebarProps = {
  noBorder?: boolean

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
  background?: string
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
    const { background, onResize, position, children, noBorder } = this.props
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

    return (
      <SidebarInteractiveContainer
        className={this.props.className}
        minWidth={minWidth}
        maxWidth={maxWidth}
        width={horizontal ? (onResize ? width : this.state.width) : '100%'}
        minHeight={minHeight}
        maxHeight={maxHeight}
        height={!horizontal ? (onResize ? height : this.state.height) : '100%'}
        resizable={resizable}
        onResize={this.onResize}
      >
        <SidebarContainer position={position} background={background}>
          {!noBorder && borderByPosition[position]}
          {children}
        </SidebarContainer>
      </SidebarInteractiveContainer>
    )
  }
}

// const SidebarChildrenDebounce = debounceRender(Contents)

const SidebarContainer = gloss({
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
  position: 'relative',
}).theme((props, theme) => {
  return {
    background: props.background || theme.sidebarBackground || theme.background.alpha(0.5),
    textOverflow: props.overflow ? 'ellipsis' : 'auto',
    whiteSpace: props.overflow ? 'nowrap' : 'normal',
  }
})
