/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */
import { isEqual } from '@o/fast-compare'
import { gloss } from 'gloss'
import * as React from 'react'

import { Rect } from './helpers/geometry'

export type OrderableOrder = string[]

type OrderableOrientation = 'horizontal' | 'vertical'

type OrderableProps = {
  items: { [key: string]: any }
  orientation: OrderableOrientation
  onChange?: (order: OrderableOrder, key: string) => void
  order?: OrderableOrder
  className?: string
  reverse?: boolean
  altKey?: boolean
  moveDelay?: number
  dragOpacity?: number
  ignoreChildEvents?: boolean
}

type OrderableState = {
  shouldUpdate?: boolean
  order?: OrderableOrder
  movingOrder?: OrderableOrder
}

type TabSizes = {
  [key: string]: Rect
}

const OrderableContainer = gloss({
  position: 'relative',
  display: 'inline-block',
})

const OrderableItemContainer = gloss<{ orientation?: OrderableOrientation }>().theme(
  ({ orientation }) => ({
    display: orientation === 'vertical' ? 'block' : 'inline-block',
  }),
)

class OrderableItem extends React.Component<{
  orientation: OrderableOrientation
  id: string
  children?: any
  addRef: (key: string, ref: HTMLElement) => void
  startMove: (KEY: string, event: React.MouseEvent) => void
}> {
  addRef = (ref: HTMLElement) => {
    this.props.addRef(this.props.id, ref)
  }

  startMove = (event: React.MouseEvent) => {
    this.props.startMove(this.props.id, event)
  }

  render() {
    return (
      <OrderableItemContainer
        orientation={this.props.orientation}
        key={this.props.id}
        nodeRef={this.addRef}
        onMouseDown={this.startMove}
      >
        {this.props.children}
      </OrderableItemContainer>
    )
  }
}

export class Orderable extends React.Component<OrderableProps, OrderableState> {
  tabRefs: {
    [key: string]: HTMLElement | void
  } = {}
  state = {
    order: null,
    shouldUpdate: false,
    movingOrder: null,
  }

  _mousemove?: any
  _mouseup?: any
  timer: any
  sizeKey: 'width' | 'height'
  offsetKey: 'left' | 'top'
  mouseKey: 'offsetX' | 'offsetY'
  screenKey: 'screenX' | 'screenY'
  containerRef?: HTMLElement

  static defaultProps = {
    dragOpacity: 1,
    moveDelay: 50,
  }

  shouldComponentUpdate() {
    return !this.state.movingOrder
  }

  static getDerivedStateFromProps(props, state) {
    if (!isEqual(props.order, state.order)) {
      return {
        shouldUpdate: true,
        order: props.order,
      }
    }
  }

  componentDidUpdate() {
    if (this.state.shouldUpdate) {
      const { orientation } = this.props
      this.sizeKey = orientation === 'horizontal' ? 'width' : 'height'
      this.offsetKey = orientation === 'horizontal' ? 'left' : 'top'
      this.mouseKey = orientation === 'horizontal' ? 'offsetX' : 'offsetY'
      this.screenKey = orientation === 'horizontal' ? 'screenX' : 'screenY'
      this.setState({ shouldUpdate: false })
    }
  }

  startMove = (key: string, event: React.MouseEvent) => {
    if (this.props.altKey === true && event.altKey === false) {
      return
    }
    if (this.props.ignoreChildEvents === true) {
      const tabRef = this.tabRefs[key]
      // @ts-ignore
      if (event.target !== tabRef && event.target.parentNode !== tabRef) {
        return
      }
    }
    this.reset()
    event.persist()
    const { moveDelay } = this.props
    if (moveDelay == null) {
      this._startMove(key, event)
    } else {
      const cancel = () => {
        clearTimeout(this.timer)
        document.removeEventListener('mouseup', cancel)
      }
      document.addEventListener('mouseup', cancel)
      this.timer = setTimeout(() => {
        cancel()
        this._startMove(key, event)
      }, moveDelay)
    }
  }

  _startMove(activeKey: string, event: React.MouseEvent) {
    // @ts-ignore
    const clickOffset = event.nativeEvent[this.mouseKey]
    // calculate offsets before we start moving element
    const sizes: TabSizes = {}
    for (const key in this.tabRefs) {
      const elem = this.tabRefs[key]
      if (elem) {
        const rect: Rect = elem.getBoundingClientRect()
        sizes[key] = {
          height: rect.height,
          left: elem.offsetLeft,
          top: elem.offsetTop,
          width: rect.width,
        }
      }
    }
    const { containerRef } = this
    if (containerRef) {
      containerRef.style.height = `${containerRef.offsetHeight}px`
      containerRef.style.width = `${containerRef.offsetWidth}px`
    }
    for (const key in this.tabRefs) {
      const elem = this.tabRefs[key]
      if (elem) {
        const size = sizes[key]
        elem.style.position = 'absolute'
        elem.style.top = `${size.top}px`
        elem.style.left = `${size.left}px`
        elem.style.height = `${size.height}px`
        elem.style.width = `${size.width}px`
      }
    }
    document.addEventListener(
      'mouseup',
      (this._mouseup = () => {
        this.stopMove(activeKey, sizes)
      }),
      { passive: true },
    )
    const screenClickPos = event.nativeEvent[this.screenKey]
    document.addEventListener(
      'mousemove',
      (this._mousemove = (event: MouseEvent) => {
        const goingOpposite = event[this.screenKey] < screenClickPos
        this.possibleMove(activeKey, goingOpposite, event, clickOffset, sizes)
      }),
      { passive: true },
    )
  }

  possibleMove(
    activeKey: string,
    goingOpposite: boolean,
    event: MouseEvent,
    cursorOffset: number,
    sizes: TabSizes,
  ) {
    // update moving tab position
    const { containerRef } = this
    const movingSize = sizes[activeKey]
    const activeTab = this.tabRefs[activeKey]
    if (containerRef) {
      const containerRect: Rect = containerRef.getBoundingClientRect()
      let newActivePos = event[this.screenKey] - containerRect[this.offsetKey] - cursorOffset // $FlowFixMe
      newActivePos = Math.max(-1, newActivePos)
      newActivePos = Math.min(newActivePos, containerRect[this.sizeKey] - movingSize[this.sizeKey])
      movingSize[this.offsetKey] = newActivePos
      if (activeTab) {
        activeTab.style.setProperty(this.offsetKey, `${newActivePos}px`)
        const { dragOpacity } = this.props
        if (dragOpacity != null && dragOpacity !== 1) {
          activeTab.style.opacity = `${dragOpacity}`
        }
      }
    }

    // figure out new order
    const zipped: [string, number][] = []
    for (const key in sizes) {
      const rect = sizes[key]
      let offset = rect[this.offsetKey]
      let size = rect[this.sizeKey]
      if (goingOpposite) {
        // when dragging opposite add the size to the offset
        if (key === activeKey) {
          // calculate the active tab to be a quarter of the actual size so when dragging in the opposite
          // direction, you need to cover 75% of the previous tab to trigger a movement
          size *= 0.25
        }
        offset += size
      } else if (key === activeKey) {
        // if not dragging in the opposite direction and we're the active tab, require covering 25% of the
        // next tab in roder to trigger a movement
        offset += size * 0.75
      }
      zipped.push([key, offset])
    }

    // calculate ordering
    const order = zipped
      .sort(([, a], [, b]) => {
        return Number(a > b)
      })
      .map(([key]) => key)

    this.moveTabs(order, activeKey, sizes)
    this.setState({ movingOrder: order })
  }

  moveTabs(order: OrderableOrder, activeKey: string | void, sizes: TabSizes) {
    let offset = 0
    for (const key of order) {
      const size = sizes[key]
      const tab = this.tabRefs[key]
      if (tab) {
        let newZIndex = key === activeKey ? 2 : 1
        const prevZIndex = tab.style.zIndex
        if (prevZIndex) {
          newZIndex += Number(prevZIndex)
        }
        tab.style.zIndex = String(newZIndex)

        if (key === activeKey) {
          tab.style.transition = 'opacity 100ms ease-in-out'
        } else {
          tab.style.transition = `${this.offsetKey} 300ms ease-in-out`
          tab.style.setProperty(this.offsetKey, `${offset}px`)
        }
        offset += size[this.sizeKey]
      }
    }
  }

  getMidpoint(rect: Rect) {
    return rect[this.offsetKey] + rect[this.sizeKey] / 2
  }

  stopMove(activeKey: string, sizes: TabSizes) {
    const { movingOrder } = this.state

    const { onChange } = this.props
    if (onChange && movingOrder) {
      const activeTab = this.tabRefs[activeKey]
      if (activeTab) {
        activeTab.style.opacity = ''

        const transitionend = () => {
          activeTab.removeEventListener('transitionend', transitionend)
          this.reset()
        }
        activeTab.addEventListener('transitionend', transitionend)
      }

      this.resetListeners()
      this.moveTabs(movingOrder, null, sizes)
      onChange(movingOrder, activeKey)
    } else {
      this.reset()
    }
    this.setState({ movingOrder: null })
  }

  resetListeners() {
    clearTimeout(this.timer)
    const { _mousemove, _mouseup } = this
    if (_mouseup) {
      document.removeEventListener('mouseup', _mouseup)
    }
    if (_mousemove) {
      document.removeEventListener('mousemove', _mousemove)
    }
  }

  reset() {
    this.resetListeners()
    const { containerRef } = this
    if (containerRef) {
      containerRef.removeAttribute('style')
    }
    for (const key in this.tabRefs) {
      const elem = this.tabRefs[key]
      if (elem) {
        elem.removeAttribute('style')
      }
    }
  }

  componentWillUnmount() {
    this.reset()
  }

  addRef = (key: string, elem: HTMLElement | void) => {
    this.tabRefs[key] = elem
  }

  setContainerRef = (ref: HTMLElement) => {
    this.containerRef = ref
  }

  render() {
    const { items } = this.props
    // calculate order of elements
    let { order } = this.state
    if (!order) {
      order = Object.keys(items)
    }
    for (const key in items) {
      if (order.indexOf(key) < 0) {
        if (this.props.reverse === true) {
          order.unshift(key)
        } else {
          order.push(key)
        }
      }
    }
    return (
      <OrderableContainer className={this.props.className} ref={this.setContainerRef}>
        {order.map(key => {
          const item = items[key]
          if (item) {
            return (
              <OrderableItem
                orientation={this.props.orientation}
                key={key}
                id={key}
                addRef={this.addRef}
                startMove={this.startMove}
              >
                {item}
              </OrderableItem>
            )
          } else {
            return null
          }
        })}
      </OrderableContainer>
    )
  }
}
