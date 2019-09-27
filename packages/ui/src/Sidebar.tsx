/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
import { selectDefined } from '@o/utils'
import { ThemeContext, ThemeObject } from 'gloss'
import * as React from 'react'

import { Interactive, InteractiveProps, ResizableSides } from './Interactive'

export type SidebarProps = Omit<InteractiveProps, 'position'> & {
  /** Toggle sidebar visibility. */
  hidden?: boolean

  /** Position sidebar absolutely. */
  floating?: boolean

  /** Don't render border element. */
  noBorder?: boolean

  /** Position of the sidebar. */
  position: 'left' | 'top' | 'right' | 'bottom'

  /** Default width of the sidebar.  Only used for left/right sidebars. */
  width?: number

  /** Minimum sidebar width. Only used for left/right sidebars. */
  minWidth?: number

  /** Maximum sidebar width. Only used for left/right sidebars. */
  maxWidth?: number

  /** Default height of the sidebar. */
  height?: number

  /** Minimum sidebar height. Only used for top/bottom sidebars. */
  minHeight?: number

  /** Maximum sidebar height. Only used for top/bottom sidebars. */
  maxHeight?: number

  /** Background color. */
  background?: string

  /** Callback when the sidebar size ahs changed. */
  onResize?: (width: number, height?: number, desiredWidth?: number) => void

  /** Contents of the sidebar. */
  children?: React.ReactNode

  /** Class name to customise styling. */
  className?: string
}

type SidebarState = {
  width?: number
  height?: number
  userChange: boolean
  minHeight?: number
  maxHeight?: number
  maxWidth?: number
  minWidth?: number
  horizontal?: boolean
  resizable?: boolean | ResizableSides
}

export class Sidebar extends React.Component<SidebarProps, SidebarState> {
  static contextType = ThemeContext

  static defaultProps = {
    position: 'left',
  }

  state = {
    userChange: false,
    width: null,
    height: null,
    minWidth: null,
    maxWidth: null,
    minHeight: null,
    maxHeight: null,
    resizable: null,
    horizontal: false,
  }

  static getDerivedStateFromProps(props: SidebarProps, state: SidebarState) {
    if (!state.userChange && (state.width !== props.width || state.height !== props.height)) {
      const { position } = props
      let height, minHeight, maxHeight, width, minWidth, maxWidth

      const resizable: { [key: string]: boolean } = {}
      if (position === 'left') {
        resizable.right = true
        ;({ width, minWidth, maxWidth } = props)
      } else if (position === 'top') {
        resizable.bottom = true
        ;({ height, minHeight, maxHeight } = props)
      } else if (position === 'right') {
        resizable.left = true
        ;({ width, minWidth, maxWidth } = props)
      } else if (position === 'bottom') {
        resizable.top = true
        ;({ height, minHeight, maxHeight } = props)
      }

      const horizontal = position === 'left' || position === 'right'

      if (horizontal) {
        width = width == null ? 200 : width
        minWidth = minWidth == null ? 200 : minWidth
        maxWidth = maxWidth == null ? 600 : maxWidth
      } else {
        height = height == null ? 200 : height
        minHeight = minHeight == null ? 200 : minHeight
        maxHeight = maxHeight == null ? 600 : maxHeight
      }

      return { width, height, minWidth, maxWidth, minHeight, maxHeight, resizable, horizontal }
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
    const {
      onResize,
      position,
      children,
      noBorder,
      hidden,
      background,
      floating,
      width: ignoreWidth,
      ...interactiveProps
    } = this.props
    const {
      minWidth,
      maxWidth,
      width,
      height,
      minHeight,
      maxHeight,
      resizable,
      horizontal,
    } = this.state

    const theme: ThemeObject = this.context.activeTheme

    // ignore
    ignoreWidth

    let positionProps = null

    if (floating) {
      positionProps = {
        position: 'absolute',
        ...(position === 'right' && { right: 0 }),
      }
    }

    return (
      <Interactive
        data-is="Sidebar"
        className={`${this.props.className || ''}`}
        minWidth={minWidth}
        maxWidth={maxWidth}
        width={horizontal ? (onResize ? width : this.state.width) : '100%'}
        minHeight={minHeight}
        maxHeight={maxHeight}
        height={!horizontal ? (onResize ? height : this.state.height) : '100%'}
        resizable={resizable}
        onResize={this.onResize}
        transition="all ease 120ms"
        opacity={hidden ? 0 : 1}
        pointerEvents={hidden ? 'none' : 'inherit'}
        position={position}
        background={background || theme.sidebarBackground}
        {...getTransform(
          hidden,
          horizontal,
          position === 'top' || position === 'left',
          selectDefined(width, height),
        )}
        bordered
        {...interactiveProps}
        {...positionProps}
      >
        {children}
      </Interactive>
    )
  }
}

const getTransform = (hidden: boolean, horizontal: boolean, invert: boolean, size: number) => {
  if (!hidden) return null
  const dir = invert ? -1 : 1
  return {
    transform: {
      ...(horizontal && { x: size * dir }),
      ...(!horizontal && { y: size * dir }),
    },
  }
}
