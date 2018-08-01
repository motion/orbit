import * as React from 'react'
import { on, react } from '@mcro/black'
import { AppStore } from '../../stores/AppStore'
import { PaneManagerStore } from './PaneManagerStore'
import { SearchStore } from '../../stores/SearchStore'
import { throttle, debounce } from 'lodash'

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

  aboveContentHeight = 0
  contentHeight = 0
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
  isActive = react(
    () => {
      const { extraCondition, name, paneStore } = this.props
      return (
        name === paneStore.activePane &&
        (extraCondition ? extraCondition() : true)
      )
    },
    isActive => {
      if (isActive === this.isActive) {
        throw react.cancel
      }
      return isActive
    },
    { immediate: true },
  )

  didMount() {
    on(this, this.paneNode, 'scroll', throttle(this.handlePaneChange, 16 * 3))
    this.addObserver(this.paneNode, this.handlePaneChange)

    // watch resizes
    // @ts-ignore
    const resizeObserver = new ResizeObserver(this.handlePaneChange)
    resizeObserver.observe(this.paneNode)
    resizeObserver.observe(this.paneInnerNode)
    // @ts-ignore
    this.subscriptions.add({
      dispose: () => resizeObserver.disconnect(),
    })

    this.handlePaneChange()
    this.updateHeight()
  }

  get fullHeight() {
    // this is the expandable filterpane in searches
    const extraHeight = this.props.searchStore.extraHeight + 14
    const fullHeight =
      extraHeight + this.contentHeight + this.aboveContentHeight
    const minHeight = 90
    // never go all the way to bottom
    const maxHeight = window.innerHeight - 50
    // cap min and max
    return Math.max(minHeight, Math.min(maxHeight, fullHeight))
  }

  get contentHeightLimited() {
    return this.fullHeight - this.aboveContentHeight
  }

  setAppHeightOnHeightChange = react(
    () => [this.fullHeight, this.isActive],
    ([height, isActive]) => {
      if (!isActive) {
        throw react.cancel
      }
      if (height === this.props.appStore.contentHeight) {
        throw react.cancel
      }
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

  handlePaneChange = debounce(() => {
    this.updateHeight()
    this.updateScrolledTo()
  }, 16)

  scrollIntoView = throttle((card: HTMLDivElement) => {
    const pane = this.paneNode
    const cardOffset = getTopOffset(card, pane)
    // too high
    if (cardOffset < pane.scrollTop) {
      // if near top just go all the way
      const scrollTop = cardOffset < 200 ? 0 : cardOffset
      pane.scrollTop = scrollTop
      return
    }
    // too low
    const cardBottom = cardOffset + card.clientHeight
    const paneBottomVisible = pane.scrollTop + pane.clientHeight
    if (cardBottom > paneBottomVisible) {
      pane.scrollTop = cardBottom - pane.clientHeight + 100 // for some reason we need this extra
    }
  }, 60)

  updateHeight = () => {
    const { top, height } = this.paneInnerNode.getBoundingClientRect()
    if (top !== this.aboveContentHeight || height !== this.contentHeight) {
      this.aboveContentHeight = top
      this.contentHeight = height
    }
  }

  updateScrolledTo = () => {
    const pane = this.paneNode
    const innerHeight = this.paneInnerNode.clientHeight
    const scrolledTo = pane.scrollTop + pane.clientHeight
    const next = innerHeight <= scrolledTo
    if (next !== this.isAtBottom) {
      this.isAtBottom = next
    }
  }
}
