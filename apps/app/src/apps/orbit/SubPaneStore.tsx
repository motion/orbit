import * as React from 'react'
import { on, react } from '@mcro/black'
import { AppStore } from '../../stores/AppStore'
import { PaneManagerStore } from './PaneManagerStore'
import { SearchStore } from '../../stores/SearchStore'
import { throttle } from 'lodash'

function getTopOffset(element, parent?) {
  let offset = 0
  while (element && element !== parent) {
    offset += element.offsetTop - element.scrollTop + element.clientTop
    element = element.offsetParent
  }
  return offset
}

export class SubPaneStore {
  props: {
    appStore: AppStore
    paneStore: PaneManagerStore
    searchStore: SearchStore
    name: string
    extraCondition: () => boolean
  }

  paneRef = React.createRef<HTMLDivElement>()
  isAtBottom = false
  childMutationObserver = null

  get paneNode() {
    return this.paneRef.current || null
  }

  get paneInnerNode() {
    return this.paneNode.firstChild as HTMLDivElement
  }

  // prevents uncessary and expensive OrbitCard re-renders
  get isActive() {
    const { extraCondition, name, paneStore } = this.props
    const isActive =
      name === paneStore.activePane &&
      (extraCondition ? extraCondition() : true)
    return isActive
  }

  didMount() {
    on(this, this.paneNode, 'scroll', _.throttle(this.handlePaneChange, 16 * 3))
    this.addObserver(this.paneRef.current, this.handlePaneChange)
    this.handlePaneChange()
    this.updateOnHeight()
  }

  addObserver = (node, cb) => {
    const observer = new MutationObserver(cb)
    observer.observe(node, { childList: true, subtree: true })
    on(this, observer)
    return () => observer.disconnect()
  }

  handlePaneChange = () => {
    this.updateOnHeight()
    this.updateScrolledTo()
  }

  scrollIntoView = throttle((card: HTMLDivElement) => {
    const pane = this.paneRef.current
    const cardOffset = getTopOffset(card, pane)
    // too high
    if (cardOffset < pane.scrollTop) {
      pane.scrollTop = cardOffset
      return
    }
    // too low
    const cardBottom = cardOffset + card.clientHeight
    const paneBottomVisible = pane.scrollTop + pane.clientHeight
    if (cardBottom > paneBottomVisible) {
      pane.scrollTop = cardBottom - pane.clientHeight + 100 // for some reason we need this extra
    }
  }, 100)

  updatePaneHeightOnActive = react(
    () => this.isActive,
    () => {
      const res = this.updateOnHeight()
      if (!res) {
        throw react.cancel
      }
    },
  )

  updateOnHeight = () => {
    if (!this.isActive || !this.props.appStore || !this.paneNode) {
      return false
    }
    const { top, height } = this.paneInnerNode.getBoundingClientRect()
    this.props.appStore.setContentHeight(top + height)
  }

  updateScrolledTo = () => {
    const pane = this.paneNode
    const innerHeight = this.paneInnerNode.clientHeight
    const scrolledTo = pane.scrollTop + pane.clientHeight
    if (innerHeight <= scrolledTo) {
      this.isAtBottom = true
    } else {
      this.isAtBottom = false
    }
  }
}
