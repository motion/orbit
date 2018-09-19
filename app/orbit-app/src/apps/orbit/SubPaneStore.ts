import * as React from 'react'
import { on, react, ensure } from '@mcro/black'
import { throttle } from 'lodash'
import { SubPaneProps } from './SubPane'
import { App } from '@mcro/stores'
import { Actions } from '../../actions/Actions'

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

  get paneNode() {
    return this.paneRef.current || null
  }

  get paneInnerNode() {
    if (!this.paneNode) {
      return null
    }
    return this.paneNode.firstChild as HTMLDivElement
  }

  isLeft() {
    const thisIndex = this.props.paneManagerStore.indexOfPane(this.props.name)
    return thisIndex < this.props.paneManagerStore.paneIndex
  }

  get isActive() {
    return this.positionState.isActive
  }

  positionState = react(
    () => {
      const { extraCondition, name, paneManagerStore } = this.props
      const isActive =
        name === paneManagerStore.activePane && (extraCondition ? extraCondition() : true)
      return {
        isActive,
        isLeft: this.isLeft(),
      }
    },
    _ => _,
    {
      onlyUpdateIfChanged: true,
      defaultValue: {
        isActive: false,
        isLeft: this.isLeft(),
      },
    },
  )

  didMount() {
    on(this, this.paneNode, 'scroll', throttle(this.onPaneScroll, 16 * 3))
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
    // TODO hacky
    // this is the expandable filterpane in searches
    let addHeight = 0
    if (this.props.name === 'search') {
      const { extraHeight } = this.props.searchStore.searchFilterStore
      addHeight = extraHeight ? extraHeight + 14 : 0
    }
    const fullHeight = addHeight + this.contentHeight + this.aboveContentHeight
    const minHeight = 90
    // never go all the way to bottom
    // cap min and max
    return Math.max(minHeight, Math.min(this.maxHeight, fullHeight))
  }

  lastHeight = react(() => this.fullHeight, _ => _, { delayValue: true })

  get contentHeightLimited() {
    return this.fullHeight - this.aboveContentHeight
  }

  setAppHeightOnHeightChange = react(
    () => [this.fullHeight, this.positionState.isActive],
    async ([height, isActive]) => {
      ensure('is active', isActive)
      ensure('new value', height !== this.props.orbitStore.contentHeight)
      this.props.orbitStore.setContentHeight(height)
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
    this.onPaneNearEdges()
  }

  scrollIntoView = throttle((card: HTMLDivElement) => {
    const pane = this.paneNode
    if (!pane) {
      return
    }
    const cardOffset = getTopOffset(card, pane)
    // too high
    if (cardOffset < pane.scrollTop) {
      // if near top just go all the way, otherwise subtract small amt for glow
      const scrollTop = cardOffset < 200 ? 0 : cardOffset - 3
      pane.scrollTop = scrollTop
      return
    }
    pane.scrollTop = cardOffset - 20
    // too low
    // const cardBottom = cardOffset + card.clientHeight
    // const paneBottomVisible = pane.scrollTop + pane.clientHeight
    // if (cardBottom > paneBottomVisible) {
    //   pane.scrollTop = cardBottom - pane.clientHeight + 100 // for some reason we need this extra
    // }
  }, 30)

  updateHeight = () => {
    // this gets full content height
    const { height } = this.paneInnerNode.getBoundingClientRect()
    // get top from here because its not affected by scroll
    const { top } = this.subPaneInner.current.getBoundingClientRect()
    if (top !== this.aboveContentHeight || height !== this.contentHeight) {
      this.aboveContentHeight = Math.max(0, top)
      this.contentHeight = height
      this.onPaneNearEdges()
    }
  }

  onPaneScroll = () => {
    this.onPaneNearEdges()
    if (App.peekState.target) {
      if (Date.now() - this.props.selectionStore.lastSelectAt > 200) {
        Actions.clearPeek()
      }
    }
  }

  onPaneNearEdges = () => {
    const pane = this.paneNode
    const innerHeight = this.paneInnerNode.clientHeight
    const scrolledTo = pane.scrollTop + pane.clientHeight
    const isAtBottom = scrolledTo >= innerHeight
    if (isAtBottom !== this.isAtBottom) {
      this.isAtBottom = isAtBottom
    }
    const isNearBottom = scrolledTo + 550 > innerHeight
    if (isNearBottom && this.props.onScrollNearBottom) {
      this.props.onScrollNearBottom()
    }
  }
}
