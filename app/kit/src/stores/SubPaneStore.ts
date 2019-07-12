import { ensure, react, useHooks } from '@o/use-store'
import { debounce, throttle } from 'lodash'
import { createRef } from 'react'

import { useStoresSimple } from '../hooks/useStores'
import { SubPaneProps } from '../views/SubPane'

const createMutationObserver = (node, options, cb) => {
  const observer = new MutationObserver(cb)
  observer.observe(node, options)
  return () => observer.disconnect()
}

const createResizObserver = (node, cb) => {
  // watch resizes
  // @ts-ignore
  const observer = new ResizeObserver(cb)
  observer.observe(node)
  return () => observer.disconnect()
}

export class SubPaneStore {
  props: Pick<SubPaneProps, 'id' | 'fullHeight' | 'onChangeHeight' | 'onScrollNearBottom'>

  hooks = useHooks(() => ({ stores: useStoresSimple() }))
  get stores() {
    return this.hooks.stores
  }
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

  get isLeft() {
    const thisIndex = this.stores.paneManagerStore.indexOfPane(this.props.id)
    return thisIndex === this.stores.paneManagerStore.paneIndex - 1
  }

  get isActive() {
    const { paneManagerStore } = this.stores
    return paneManagerStore.activePane && this.props.id === paneManagerStore.activePane.id
  }

  triggerRewatch = 0

  watchParentNode = react(
    () => [this.paneNode, this.triggerRewatch],
    ([node], { useEffect }) => {
      ensure('hasNode', !!node)
      ensure('not fullHeight', !this.props.fullHeight)

      useEffect(() => {
        const handleScroll = throttle(this.onPaneScroll, 16 * 3)
        node.addEventListener('scroll', handleScroll, { passive: true })
        return () => {
          node.removeEventListener('scroll', handleScroll)
        }
      })

      useEffect(() => {
        return createMutationObserver(node, { childList: true, subtree: true }, () => {
          this.triggerRewatch = Math.random()
        })
      })

      useEffect(() => {
        return createResizObserver(node, this.handlePaneChange)
      })

      this.handlePaneChange()
    },
  )

  watchInnerNode = react(
    () => this.paneInnerNode,
    (node, { useEffect }) => {
      ensure('hasNode', !!node)
      ensure('not fullHeight', !this.props.fullHeight)

      useEffect(() => {
        return createResizObserver(node, this.handlePaneChange)
      })

      useEffect(() =>
        createMutationObserver(this.paneInnerNode, { attributes: true }, this.handlePaneChange),
      )
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
