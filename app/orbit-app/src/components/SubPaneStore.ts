import { ensure, on, react } from '@mcro/black'
import { App } from '@mcro/stores'
import { useHook } from '@mcro/use-store'
import { debounce, throttle } from 'lodash'
import { createRef } from 'react'
import { AppActions } from '../actions/AppActions'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { SubPaneProps } from './SubPane'

export class SubPaneStore {
  props: SubPaneProps
  stores = useHook(() => useStoresSafe({ optional: ['selectionStore'] }))

  innerPaneRef = createRef<HTMLDivElement>()
  paneRef = createRef<HTMLDivElement>()

  aboveContentHeight = 0
  contentHeight = 0
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

  get isLeft() {
    const thisIndex = this.stores.paneManagerStore.indexOfPane(this.props.id)
    return thisIndex < this.stores.paneManagerStore.paneIndex
  }

  get isActive() {
    return this.positionState.isActive
  }

  positionState = react(
    () => {
      const { extraCondition, id } = this.props
      const { paneManagerStore } = this.stores
      const isActive =
        paneManagerStore.activePane &&
        id === paneManagerStore.activePane.id &&
        (extraCondition ? extraCondition() : true)
      return {
        isActive,
        isLeft: this.isLeft,
      }
    },
    _ => _,
    {
      onlyUpdateIfChanged: true,
      defaultValue: {
        isActive: false,
        isLeft: this.isLeft,
      },
    },
  )

  didGetPaneNode = react(
    () => !!this.paneNode,
    hasNode => {
      ensure('hasNode', hasNode)
      ensure('not fullHeight', !this.props.fullHeight)
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
    },
  )

  get maxHeight() {
    return window.innerHeight - this.aboveContentHeight
  }

  get fullHeight() {
    const fullHeight = this.contentHeight + this.aboveContentHeight
    const minHeight = 90
    // never go all the way to bottom, cap min and max
    return Math.max(minHeight, fullHeight)
  }

  lastHeight = react(() => this.fullHeight, _ => _, { delayValue: true })

  onChangeHeight = react(
    () => [this.fullHeight, this.positionState.isActive],
    async ([height, isActive]) => {
      ensure('is active', isActive)
      ensure('onChangeHeight', !!this.props.onChangeHeight)
      if (this.props.onChangeHeight) {
        this.props.onChangeHeight(height)
      }
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
    this.onPaneNearEdges()
  }, 16)

  updateHeight = async () => {
    if (!this.paneInnerNode) {
      return
    }
    // this gets full content height
    const { height } = this.paneInnerNode.getBoundingClientRect()
    // get top from here because its not affected by scroll
    const { top } = this.innerPaneRef.current.getBoundingClientRect()
    if (top !== this.aboveContentHeight || height !== this.contentHeight) {
      this.aboveContentHeight = Math.max(0, top)
      this.contentHeight = height
      this.onPaneNearEdges()
    }
  }

  onPaneScroll = () => {
    this.onPaneNearEdges()
    if (App.peekState.target) {
      if (Date.now() - this.stores.selectionStore.lastSelectAt > 200) {
        AppActions.clearPeek()
      }
    }
  }

  onPaneNearEdges = () => {
    const pane = this.paneNode
    if (!pane) {
      return
    }
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
