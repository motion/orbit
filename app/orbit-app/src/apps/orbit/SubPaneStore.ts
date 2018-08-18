import * as React from 'react'
import { on, react } from '@mcro/black'
import { throttle } from 'lodash'
import { SubPaneProps } from './SubPane'

function getTopOffset(element, parent?) {
  let offset = 0
  while (element && element !== parent) {
    offset += element.offsetTop - element.scrollTop + element.clientTop
    element = element.offsetParent
  }
  return offset
}

export class SubPaneStore {
  props: SubPaneProps

  aboveContentHeight = 0
  contentHeight = 0
  subPaneInner = React.createRef<HTMLDivElement>()
  paneRef = React.createRef<HTMLDivElement>()
  isAtBottom = false
  childMutationObserver = null
  isTransitioningToActive = false

  get paneNode() {
    return this.paneRef.current || null
  }

  get paneInnerNode() {
    if (!this.paneNode) {
      return null
    }
    return this.paneNode.firstChild as HTMLDivElement
  }

  get isLeft() {
    const thisIndex = this.props.paneManagerStore.indexOfPane(this.props.name)
    return thisIndex < this.props.paneManagerStore.paneIndex
  }

  // prevents uncessary and expensive OrbitCard re-renders
  isActive = react(
    () => {
      const { extraCondition, name, paneManagerStore } = this.props
      return (
        name === paneManagerStore.activePane &&
        (extraCondition ? extraCondition() : true)
      )
    },
    isActive => {
      if (isActive === this.isActive) {
        throw react.cancel
      }
      if (isActive) {
        this.isTransitioningToActive = true
      }
      return isActive
    },
    { defaultValue: false },
  )

  didMount() {
    on(this, this.paneNode, 'scroll', throttle(this.updateScrolledTo, 16 * 3))
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

  get maxHeight() {
    return window.innerHeight - 50
  }

  get fullHeight() {
    // this is the expandable filterpane in searches
    const framePad = 8
    const { extraHeight } = this.props.searchStore.searchFilterStore
    const addHeight = extraHeight ? extraHeight + 14 : 0
    const fullHeight =
      addHeight + this.contentHeight + this.aboveContentHeight + framePad
    const minHeight = 90
    // never go all the way to bottom
    // cap min and max
    return Math.max(minHeight, Math.min(this.maxHeight, fullHeight))
  }

  lastHeight = react(() => this.fullHeight, _ => _, { delayValue: true })

  get contentHeightLimited() {
    return this.fullHeight - this.aboveContentHeight
  }

  hasRunOnce = false

  setAppHeightOnHeightChange = react(
    () => [this.fullHeight, this.isActive],
    async ([height, isActive], { sleep }) => {
      if (!isActive) {
        this.hasRunOnce = false
        throw react.cancel
      }
      // on first transition go fast
      if (this.isTransitioningToActive) {
        this.isTransitioningToActive = false
      } else {
        // on next transitions, if not at full height, debounce
        const isLessThanMax = height < this.maxHeight
        const willBeShorter = height < this.lastHeight
        if (isLessThanMax && willBeShorter) {
          await sleep(100)
        }
      }
      react.ensure(
        'different height',
        height !== this.props.appStore.contentHeight,
      )
      this.props.appStore.setContentHeight(height)
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
    const pane = this.paneNode
    const cardOffset = getTopOffset(card, pane)
    // too high
    if (cardOffset < pane.scrollTop) {
      // if near top just go all the way, otherwise subtract small amt for glow
      const scrollTop = cardOffset < 200 ? 0 : cardOffset - 3
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
    // this gets full content height
    const { height } = this.paneInnerNode.getBoundingClientRect()
    // get top from here because its not affected by scroll
    const { top } = this.subPaneInner.current.getBoundingClientRect()
    if (top !== this.aboveContentHeight || height !== this.contentHeight) {
      this.aboveContentHeight = Math.max(0, top)
      this.contentHeight = height
    }
  }

  updateScrolledTo = () => {
    const pane = this.paneNode
    const innerHeight = this.paneInnerNode.clientHeight
    const scrolledTo = pane.scrollTop + pane.clientHeight
    const isAtBottom = scrolledTo >= innerHeight
    if (isAtBottom !== this.isAtBottom) {
      this.isAtBottom = isAtBottom
    }
    const isNearBottom = scrolledTo + 450 > innerHeight
    if (isNearBottom && this.props.onScrollNearBottom) {
      console.log('SCROLL NEAR BOTTOM TRIGGER')
      this.props.onScrollNearBottom()
    }
  }
}
