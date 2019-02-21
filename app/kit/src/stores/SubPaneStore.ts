import { on } from '@mcro/helpers'
import { ensure, react, useHook } from '@mcro/use-store'
import { debounce, throttle } from 'lodash'
import { createRef } from 'react'
import { useStoresSimple } from '../helpers/useStores'
import { SubPaneProps } from '../views/SubPane'

export class SubPaneStore {
  props: SubPaneProps

  stores = useHook(useStoresSimple)
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
    if (!this.paneNode) return null
    return this.paneNode.firstChild as HTMLDivElement
  }

  isLeft = react(
    () => {
      const thisIndex = this.stores.paneManagerStore.indexOfPane(this.props.id)
      return thisIndex === this.stores.paneManagerStore.paneIndex - 1
    },
    _ => _,
    // not very time sensitive or as important as isActive
    {
      delay: 40,
    },
  )

  isActive = react(
    () => {
      const { paneManagerStore } = this.stores
      return paneManagerStore.activePane && this.props.id === paneManagerStore.activePane.id
    },
    _ => _,
  )

  triggerRewatch = 0
  watchParentNode = react(
    () => [this.paneNode, this.triggerRewatch],
    ([node]) => {
      ensure('hasNode', !!node)
      ensure('not fullHeight', !this.props.fullHeight)
      if (this.watchParentNode) {
        this.watchParentNode.forEach(disconnect => disconnect())
      }

      const scrollO = on(this, node, 'scroll', throttle(this.onPaneScroll, 16 * 3))

      // re-run this watch when we see a mutation
      const mutationO = this.useMutationObserver(node, { childList: true, subtree: true }, () => {
        this.triggerRewatch = Math.random()
      })
      const resizeO = this.useResizeObserver(node, this.handlePaneChange)

      this.handlePaneChange()

      return [scrollO, mutationO, resizeO]
    },
  )

  watchInnerNode = react(
    () => this.paneInnerNode,
    node => {
      ensure('hasNode', !!node)
      ensure('not fullHeight', !this.props.fullHeight)
      if (this.watchInnerNode) {
        this.watchInnerNode.forEach(disconnect => disconnect())
      }

      const resizeO = this.useResizeObserver(node, this.handlePaneChange)
      const mutationO = this.useMutationObserver(
        this.paneInnerNode,
        { attributes: true },
        this.handlePaneChange,
      )

      return [resizeO, mutationO]
    },
  )

  windowHeight = window.innerHeight

  get maxHeight() {
    // just leave a little extra padding
    return this.windowHeight - this.aboveContentHeight - 20
  }

  get fullHeight() {
    const fullHeight = this.contentHeight + this.aboveContentHeight
    const minHeight = 90
    // never go all the way to bottom, cap min and max
    return Math.min(this.maxHeight, Math.max(minHeight, fullHeight))
  }

  onChangeHeight = react(
    () => [this.fullHeight, this.isActive],
    ([height, isActive]) => {
      if (this.props.onChangeHeight && isActive) {
        this.props.onChangeHeight(height)
      }
    },
  )

  useResizeObserver = (node, cb) => {
    // watch resizes
    // @ts-ignore
    const observer = new ResizeObserver(cb)
    observer.observe(node)
    const off = () => observer.disconnect()
    on(this, { unsubscribe: off })
    return off
  }

  useMutationObserver = (node, options, cb) => {
    const observer = new MutationObserver(cb)
    observer.observe(node, options)
    const off = () => observer.disconnect()
    on(this, { unsubscribe: off })
    return off
  }

  handlePaneChange = debounce(() => {
    this.updateHeight()
    this.onPaneNearEdges()
  })

  updateHeight = async () => {
    if (!this.paneInnerNode) {
      console.warn('no pane inner node...', this.props.id, this.props)
      return
    }
    // this gets full content height
    const { height } = this.paneInnerNode.getBoundingClientRect()
    if (height === 0) {
      return
    }
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
