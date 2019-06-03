/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
import { isEqual } from '@o/fast-compare'
import { on } from '@o/utils'
import { Col, gloss } from 'gloss'
import invariant from 'invariant'
import { pick } from 'lodash'
import React, { createContext, createRef } from 'react'

import { Rect } from './helpers/geometry'
import { isRightClick } from './helpers/isRightClick'
import LowPassFilter from './helpers/LowPassFilter'
import { getDistanceTo, maybeSnapLeft, maybeSnapTop, SNAP_SIZE } from './helpers/snap'
import { InteractiveChrome } from './InteractiveChrome'
import { ResizeObserverCallback } from './ResizeObserver'
import { Omit } from './types'
import { View, ViewProps } from './View/View'

// TODO make prop
const SIZE = 5

// the deeper we go, the less natural zIndex we want
// so that outer panes will have their draggers "cover" inner ones
// think of a <Pane> with a <TableHeadCol> inside, Pane should override
// this achieves that by automatically tracking Interactive nesting
const InteractiveNesting = createContext(0)

type CursorState = {
  top: number
  left: number
}

export type ResizableSides = {
  left?: boolean
  top?: boolean
  bottom?: boolean
  right?: boolean
}

const ALL_RESIZABLE: ResizableSides = {
  bottom: true,
  left: true,
  right: true,
  top: true,
}

export type InteractiveProps = Omit<
  ViewProps,
  'minHeight' | 'minWidth' | 'visibility' | 'position' | 'right' | 'top' | 'left'
> & {
  position?: string
  disabled?: boolean
  disableFloatingGrabbers?: boolean
  isMovableAnchor?: (event: MouseEvent) => boolean
  onMoveStart?: () => void
  onMoveEnd?: () => void
  onMove?: (top: number, left: number, event: MouseEvent) => void
  id?: string
  movable?: boolean
  hidden?: boolean
  moving?: boolean
  fill?: boolean
  siblings?: { [key: string]: Rect }
  updateCursor?: (cursor: string | void) => void
  zIndex?: number
  right?: number
  top?: number
  left?: number
  minTop?: number
  minLeft?: number
  width?: number | string
  height?: number | string
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  onCanResize?: (sides?: ResizableSides) => void
  onResizeStart?: () => void
  onResizeEnd?: () => void
  onResize?: (
    width: number,
    height?: number,
    desiredWidth?: number,
    desiredHeight?: number,
    resizingSides?: ResizableSides,
  ) => void
  resizing?: boolean
  resizable?: boolean | ResizableSides
  style?: Record<string, any>
  className?: string
  children?: any
}

type InteractiveState = {
  chromeKey: number
  moving: boolean
  movingInitialProps: InteractiveProps | void
  movingInitialCursor: CursorState | void
  cursor: string | void
  resizingSides: ResizableSides
  couldResize: boolean
  resizing: boolean
  resizingInitialRect: Rect | void
  resizingInitialCursor: CursorState | void
}

// controlled
export class Interactive extends React.Component<InteractiveProps, InteractiveState> {
  static contextType = InteractiveNesting

  static defaultProps = {
    minHeight: 0,
    minLeft: 0,
    minTop: 0,
    minWidth: 0,
    maxWidth: 10000,
    maxHeight: 10000,
  }

  ref = createRef<HTMLElement>()
  globalMouse = false

  state = {
    chromeKey: 0,
    couldResize: false,
    cursor: null,
    moving: false,
    movingInitialCursor: null,
    movingInitialProps: null,
    resizing: false,
    resizingInitialCursor: null,
    resizingInitialRect: null,
    resizingSides: null,
  }

  nextTop?: number
  nextLeft?: number
  nextEvent?: MouseEvent

  onMouseMove = (event: MouseEvent) => {
    if (this.props.disabled) {
      return
    }
    if (this.state.moving) {
      this.calculateMove(event)
    } else if (this.state.resizing) {
      this.calculateResize(event)
    } else {
      this.calculateResizable(event)
    }
  }

  onMouseDown = event => {
    if (isRightClick(event)) return
    if (!this.state.cursor) return
    event.stopPropagation()
    this.globalMouse = true
    window.addEventListener('pointerup', this.endAction, { passive: true })
    window.addEventListener('pointermove', this.onMouseMove, { passive: true })

    const { isMovableAnchor } = this.props
    if (isMovableAnchor && isMovableAnchor(event)) {
      this.startTitleAction(event)
    } else {
      this.startWindowAction(event)
    }
  }

  startTitleAction(event: MouseEvent) {
    if (this.state.couldResize) {
      this.startResizeAction(event)
    } else if (this.props.movable === true) {
      this.startMoving(event)
    }
  }

  startMoving(event: MouseEvent) {
    const { onMoveStart } = this.props
    if (onMoveStart) {
      onMoveStart()
    }

    const topLpf = new LowPassFilter()
    const leftLpf = new LowPassFilter()

    this.nextTop = null
    this.nextLeft = null
    this.nextEvent = null

    const onFrame = () => {
      if (!this.state.moving) {
        return
      }

      const { nextEvent, nextTop, nextLeft } = this
      if (nextEvent && nextTop != null && nextLeft != null) {
        if (topLpf.hasFullBuffer()) {
          const newTop = topLpf.next(nextTop)
          const newLeft = leftLpf.next(nextLeft)
          this.move(newTop, newLeft, nextEvent)
        } else {
          this.move(nextTop, nextLeft, nextEvent)
        }
      }

      requestAnimationFrame(onFrame)
    }

    this.setState(
      {
        cursor: 'move',
        moving: true,
        movingInitialCursor: {
          left: event.clientX,
          top: event.clientY,
        },
        movingInitialProps: this.props,
      },
      onFrame,
    )
  }

  getPossibleTargetWindows(rect: Rect) {
    const closeWindows = []
    const { siblings } = this.props
    if (siblings) {
      for (const key in siblings) {
        if (key === this.props.id) {
          // don't target ourselves
          continue
        }

        const win = siblings[key]
        const distance = getDistanceTo(rect, win)
        if (distance <= SNAP_SIZE) {
          closeWindows.push(win)
        }
      }
    }

    return closeWindows
  }

  startWindowAction(event: MouseEvent) {
    if (this.state.couldResize) {
      this.startResizeAction(event)
    }
  }

  startResizeAction(event: MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    const { onResizeStart } = this.props
    if (onResizeStart) {
      onResizeStart()
    }
    this.setState({
      resizing: true,
      resizingInitialCursor: {
        left: event.clientX,
        top: event.clientY,
      },
      resizingInitialRect: this.getRect(),
    })
  }

  componentDidUpdate(_: InteractiveProps, prevState: InteractiveState) {
    if (prevState.cursor !== this.state.cursor) {
      const { updateCursor } = this.props
      if (updateCursor) {
        updateCursor(this.state.cursor)
      }
    }
  }

  currentRect = {
    top: 0,
    left: 0,
  }

  componentDidMount() {
    this.trackNodePos(this.ref.current)
  }

  trackNodePos(node) {
    this.useResizeObserver(node, entries => {
      this.lastMeasure = Date.now()
      this.currentRect = entries[0].contentRect
    })
    this.currentRect = node.getBoundingClientRect()
  }

  useResizeObserver = (node, cb: ResizeObserverCallback) => {
    // watch resizes
    // @ts-ignore
    const observer = new ResizeObserver(cb)
    observer.observe(node)
    const off = () => observer.disconnect()
    on(this, { unsubscribe: off })
    return off
  }

  resetMoving() {
    const { onMoveEnd } = this.props
    if (onMoveEnd) {
      onMoveEnd()
    }
    this.setState({
      cursor: undefined,
      moving: false,
      movingInitialProps: undefined,
      resizingInitialCursor: undefined,
    })
  }

  resetResizing() {
    const { onResizeEnd } = this.props
    if (onResizeEnd) {
      onResizeEnd()
    }
    this.setState({
      resizing: false,
      resizingInitialCursor: undefined,
      resizingInitialRect: undefined,
      resizingSides: undefined,
    })
  }

  componentWillUnmount() {
    this.endAction()
  }

  endAction = () => {
    this.globalMouse = false
    window.removeEventListener('pointermove', this.onMouseMove)
    window.removeEventListener('pointerup', this.endAction)
    if (this.state.moving) {
      this.resetMoving()
    }
    if (this.state.resizing) {
      this.resetResizing()
    }
  }

  onMouseLeave = () => {
    if (!this.state.resizing && !this.state.moving && this.state.cursor) {
      this.setState({
        cursor: undefined,
        resizingSides: null,
      })
    }
  }

  calculateMove(event: MouseEvent) {
    const { movingInitialCursor, movingInitialProps } = this.state
    invariant(movingInitialProps, 'TODO')
    invariant(movingInitialCursor, 'TODO')
    const { clientX: cursorLeft, clientY: cursorTop } = event
    const movedLeft = movingInitialCursor.left - cursorLeft
    const movedTop = movingInitialCursor.top - cursorTop
    let newLeft = (movingInitialProps.left || 0) - movedLeft
    let newTop = (movingInitialProps.top || 0) - movedTop
    if (event.altKey) {
      const snapProps = this.getRect()
      const windows = this.getPossibleTargetWindows(snapProps)
      newLeft = maybeSnapLeft(snapProps, windows, newLeft)
      newTop = maybeSnapTop(snapProps, windows, newTop)
    }
    this.nextTop = newTop
    this.nextLeft = newLeft
    this.nextEvent = event
  }

  resize(width: number, height: number) {
    if (width === this.props.width && height === this.props.height) {
      // noop
      return
    }
    const { onResize } = this.props
    if (!onResize) {
      return
    }
    let fwidth = Math.min(this.props.maxWidth, Math.max(this.props.minWidth, width))
    let fheight = Math.min(this.props.maxHeight, Math.max(this.props.minHeight, height))
    onResize(fwidth, fheight, width, height, this.state.resizingSides)
  }

  move(newTop: number, newLeft: number, event: MouseEvent) {
    const top = Math.max(this.props.minTop, newTop)
    const left = Math.max(this.props.minLeft, newLeft)
    if (top === this.props.top && left === this.props.left) {
      // noop
      return
    }
    const { onMove } = this.props
    if (onMove) {
      onMove(top, left, event)
    }
  }

  calculateResize(event: MouseEvent) {
    const { resizingInitialCursor, resizingInitialRect, resizingSides } = this.state
    try {
      invariant(resizingInitialRect, 'resizingInitialRect')
      invariant(resizingInitialCursor, 'resizingInitialCursor')
      invariant(resizingSides, 'resizingSides')
    } catch {
      return
    }
    const deltaLeft = resizingInitialCursor.left - event.clientX
    const deltaTop = resizingInitialCursor.top - event.clientY
    let newLeft = resizingInitialRect.left
    let newTop = resizingInitialRect.top
    let newWidth = resizingInitialRect.width
    let newHeight = resizingInitialRect.height
    // right
    if (resizingSides.right === true) {
      newWidth -= deltaLeft
    }
    // bottom
    if (resizingSides.bottom === true) {
      newHeight -= deltaTop
    }
    const rect = this.getRect()
    // left
    if (resizingSides.left === true) {
      newLeft -= deltaLeft
      newWidth += deltaLeft
      if (this.props.movable === true) {
        // prevent from being shrunk past the minimum width
        const right = rect.left + rect.width
        const maxLeft = right - this.props.minWidth
        let cleanLeft = Math.max(0, newLeft)
        cleanLeft = Math.min(cleanLeft, maxLeft)
        newWidth -= Math.abs(newLeft - cleanLeft)
        newLeft = cleanLeft
      }
    }
    // top
    if (resizingSides.top === true) {
      newTop -= deltaTop
      newHeight += deltaTop
      if (this.props.movable === true) {
        // prevent from being shrunk past the minimum height
        const bottom = rect.top + rect.height
        const maxTop = bottom - this.props.minHeight
        let cleanTop = Math.max(0, newTop)
        cleanTop = Math.min(cleanTop, maxTop)
        newHeight += newTop - cleanTop
        newTop = cleanTop
      }
    }
    if (event.altKey) {
      const windows = this.getPossibleTargetWindows(rect)
      if (resizingSides.left === true) {
        const newLeft2 = maybeSnapLeft(rect, windows, newLeft)
        newWidth += newLeft - newLeft2
        newLeft = newLeft2
      }
      if (resizingSides.top === true) {
        const newTop2 = maybeSnapTop(rect, windows, newTop)
        newHeight += newTop - newTop2
        newTop = newTop2
      }
      if (resizingSides.bottom === true) {
        newHeight = maybeSnapTop(rect, windows, newTop + newHeight) - newTop
      }
      if (resizingSides.right === true) {
        newWidth = maybeSnapLeft(rect, windows, newLeft + newWidth) - newLeft
      }
    }
    this.move(newTop, newLeft, event)
    this.resize(newWidth, newHeight)
  }

  getRect(): Rect {
    const { props, ref } = this
    invariant(ref, 'expected ref')
    return {
      height: ref.current.offsetHeight || 0,
      left: props.left || 0,
      top: props.top || 0,
      width: ref.current.offsetWidth || 0,
    }
  }

  getResizable(): ResizableSides {
    const { resizable } = this.props
    if (resizable === true) {
      return ALL_RESIZABLE
    } else if (resizable == null || resizable === false) {
      return
    } else {
      return resizable
    }
  }

  lastMeasure = Date.now()
  getCurrentRect() {
    // force update every so often in case things animate
    if (Date.now() - this.lastMeasure > 3000) {
      this.currentRect = this.ref.current.getBoundingClientRect()
      this.lastMeasure = Date.now()
    }
    return this.currentRect
  }

  checkIfResizable(
    event: MouseEvent,
  ): {
    left: boolean
    right: boolean
    top: boolean
    bottom: boolean
  } {
    const canResize = this.getResizable()
    if (!canResize) {
      return
    }
    if (!this.ref.current) {
      return
    }
    const { left: offsetLeft, top: offsetTop } = this.getCurrentRect()
    const { height, width } = this.getRect()
    const x = event.clientX - offsetLeft
    const y = event.clientY - offsetTop
    const atTop: boolean = y <= SIZE
    const atBottom: boolean = y >= height - SIZE
    const atLeft: boolean = x <= SIZE
    const atRight: boolean = x >= width - SIZE
    return {
      bottom: canResize.bottom === true && atBottom,
      left: canResize.left === true && atLeft,
      right: canResize.right === true && atRight,
      top: canResize.top === true && atTop,
    }
  }

  calculateResizable(event: MouseEvent) {
    const resizing = this.checkIfResizable(event)
    if (!resizing) {
      return
    }
    const canResize = this.getResizable()
    if (!canResize) {
      return
    }
    let newCursor = getResizeCursor(resizing)
    const movingHorizontal = resizing.left || resizing.right
    const movingVertical = resizing.top || resizing.left

    // if resizing vertically and one side can't be resized then use different cursor
    if (movingHorizontal && (canResize.left !== true || canResize.right !== true)) {
      newCursor = 'col-resize'
    }
    // if resizing horizontally and one side can't be resized then use different cursor
    if (
      movingVertical &&
      !movingHorizontal &&
      (canResize.top !== true || canResize.bottom !== true)
    ) {
      newCursor = 'row-resize'
    }
    const next = {
      couldResize: !!newCursor,
      cursor: newCursor,
      resizingSides: resizing,
    }
    if (!isEqual(next, pick(this.state, 'couldResize', 'cursor', 'resizingSides'))) {
      const { onCanResize } = this.props
      if (onCanResize) {
        onCanResize()
      }
      this.setState(next)
    }
  }

  onLocalMouseMove = event => {
    if (!this.globalMouse) {
      this.onMouseMove(event)
    }
  }

  updatePosition() {
    this.setState({ chromeKey: Math.random() })
  }

  render() {
    const {
      fill,
      height,
      left,
      movable,
      top,
      width,
      disableFloatingGrabbers,
      disabled,
      minWidth,
      maxHeight,
      maxWidth,
      minHeight,
      position,
      right,
      pointerEvents,
      ...props
    } = this.props
    const { resizingSides } = this.state
    const cursor = this.state.cursor
    const zIndex = typeof props.zIndex === 'undefined' ? 10000000 - this.context : props.zIndex
    const style: any = {}
    if (movable === true || top != null || left != null) {
      if (fill === true) {
        style.left = left || 0
        style.top = top || 0
      } else {
        style.transform = `translate3d(${left || 0}px, ${top || 0}px, 0)`
      }
    }
    if (fill === true) {
      style.right = 0
      style.bottom = 0
      style.width = '100%'
      style.height = '100%'
    } else {
      style.width = width == null ? 'auto' : width
      style.height = height == null ? 'auto' : height
    }
    if (this.props.style) {
      Object.assign(style, this.props.style)
    }
    const resizable = this.getResizable()
    const listenerProps = {
      onMouseDown: this.onMouseDown,
      onMouseMove: this.onLocalMouseMove,
      onMouseLeave: this.onMouseLeave,
    }
    const useFloatingGrabbers = !disabled && resizable && !disableFloatingGrabbers

    if (typeof zIndex !== 'number') {
      debugger
    }

    return (
      <InteractiveNesting.Provider value={this.context.nesting + 1}>
        <Col
          className={this.props.className}
          {...{
            position,
            cursor,
            left,
            top,
            right,
            bottom: null,
            transform: null,
            width: null,
            height: null,
            minWidth,
            maxHeight,
            maxWidth,
            minHeight,
            zIndex,
            pointerEvents,
            ...style,
          }}
        >
          <InteractiveContainer
            hidden={this.props.hidden}
            ref={this.ref}
            {...listenerProps}
            {...props}
          >
            {/* makes a better grabbable bar that appears above other elements and can prevent clickthrough */}
            {useFloatingGrabbers && (
              <InteractiveChrome
                key={this.state.chromeKey}
                parent={this.ref}
                onMouseDown={listenerProps.onMouseDown}
                resizingSides={resizingSides}
                zIndex={zIndex + 1}
              />
            )}
            {this.props.children}
          </InteractiveContainer>
        </Col>
      </InteractiveNesting.Provider>
    )
  }
}

const InteractiveContainer = gloss(View, {
  width: '100%',
  height: '100%',
  position: 'relative',
  willChange: 'transform, height, width, z-index',
})

export function getResizeCursor(sides: ResizableSides): string | undefined {
  const { bottom, left, right, top } = sides
  let newCursor
  // left
  if (left) {
    newCursor = 'ew-resize'
  }
  // right
  if (right) {
    newCursor = 'ew-resize'
  }
  // top
  if (top) {
    newCursor = 'ns-resize'
    // top left
    if (left) {
      newCursor = 'nwse-resize'
    }
    // top right
    if (right) {
      newCursor = 'nesw-resize'
    }
  }
  // bottom
  if (bottom) {
    newCursor = 'ns-resize'
    // bottom left
    if (left) {
      newCursor = 'nesw-resize'
    }
    // bottom right
    if (right) {
      newCursor = 'nwse-resize'
    }
  }
  return newCursor
}
