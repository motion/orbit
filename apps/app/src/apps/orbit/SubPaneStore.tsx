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

  height = 0
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
    console.log('mount it up', this.props)
    on(this, this.paneNode, 'scroll', _.throttle(this.handlePaneChange, 16 * 3))
    this.addObserver(this.paneRef.current, this.handlePaneChange)
    this.handlePaneChange()
    this.updateHeight()
  }

  get heightWithExtraFilters() {
    // add padding + filters height
    return this.height + this.props.searchStore.extraHeight + 14
  }

  setAppHeightOnHeightChange = react(
    () => [this.heightWithExtraFilters, this.isActive],
    ([height, isActive]) => {
      if (!isActive) {
        throw react.cancel
      }
      console.log('height with extra', height, this.height, this.props)
      this.props.appStore.setContentHeight(height)
    },
    {
      immediate: true,
    },
  )

  addObserver = (node, cb) => {
    const observer = new MutationObserver(cb)
    observer.observe(node, { childList: true, subtree: true })
    on(this, observer)
    return () => observer.disconnect()
  }

  handlePaneChange = () => {
    this.updateHeight()
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
      const res = this.updateHeight()
      if (!res) {
        throw react.cancel
      }
    },
  )

  updateHeight = () => {
    if (!this.props.appStore || !this.paneNode) {
      return
    }
    if (!this.isActive && this.height) {
      return
    }
    const { top, height } = this.paneInnerNode.getBoundingClientRect()
    console.log('updating height', top, height)
    if (top + height === 0) {
      debugger
    }
    this.height = top + height
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
