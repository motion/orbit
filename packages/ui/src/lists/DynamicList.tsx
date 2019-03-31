/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { isEqual } from '@o/fast-compare'
import { Contents, gloss } from '@o/gloss'
import React, { forwardRef, memo, PureComponent, RefObject, useRef } from 'react'
import { useOnMount } from '../hooks/useOnMount'
import { useParentNodeSize } from '../hooks/useParentNodeSize'

export type DynamicListProps = {
  disableMeasure?: boolean
  listRef?: RefObject<DynamicListControlled>
  maxHeight?: number
  height?: number | 'content-height'
  width?: number | string
  children: (params: { index: number; style: Record<string, any> }) => any
  itemCount: number
  itemData: any
  keyMapper?: (index: number) => string
  outerRef?: any
  onMount?: () => void
  itemSize?: (
    index: number,
  ) => {
    width: number | string
    height: number
  }
  onScroll?: (props: {
    scrollDirection: 'forward' | 'backward'
    scrollHeight: number
    scrollTop: number
    clientHeight: number
  }) => void
  sideScrollable?: boolean
}

export const DynamicList = forwardRef(({ disableMeasure, ...props }: DynamicListProps, ref) => {
  const parentSize = useParentNodeSize({
    disable: disableMeasure,
  })

  return (
    <Contents ref={parentSize.ref}>
      <DynamicListControlled
        ref={props.listRef || (ref as any)}
        width={parentSize.width}
        height={parentSize.height}
        {...props}
      />
    </Contents>
  )
})

type DynamicListState = {
  mounted: boolean
  startIndex: number
  endIndex: number
  containerStyle: any
  innerStyle: Record<string, any>
  scrollHeight: number
  scrollTop: number
  height: number
  shouldMeasure: boolean
}

export class DynamicListControlled extends PureComponent<DynamicListProps, DynamicListState> {
  static defaultProps = {
    keyMapper: (i: any) => i,
  }

  state: DynamicListState = {
    mounted: false,
    startIndex: -1,
    endIndex: -1,
    containerStyle: {},
    innerStyle: {},
    scrollHeight: 0,
    scrollTop: 0,
    height: 0,
    shouldMeasure: false,
  }

  containerRef: HTMLDivElement | null
  measureQueue: Map<string, any> = new Map()
  topPositionToIndex: Map<number, number> = new Map()
  positions: Map<
    number,
    {
      top: number
      style: Record<string, any>
    }
  > = new Map()
  dimensions: Map<
    string,
    {
      width: number | string
      height: number
    }
  > = new Map()

  static getDerivedStateFromProps(
    props: DynamicListProps,
    state: DynamicListState,
  ): Partial<DynamicListState> {
    if (props.height !== 'content-height' && props.height !== state.height) {
      return {
        height: +props.height,
        shouldMeasure: true,
      }
    }
    return null
  }

  lastHeight = 23
  scrollToIndex = (index: number, additionalOffset: number = 0) => {
    if (index === -1) return
    const pos = this.positions.get(index)
    if (!pos) return
    const ref = this.getContainerRef()
    const dims = this.dimensions.get(this.props.keyMapper(index))
    const h = dims ? dims.height : this.lastHeight
    this.lastHeight = h
    const top = pos.top - additionalOffset
    const bot = pos.top + h - additionalOffset

    // lazy scroll
    if (pos != null && ref != null) {
      if (top < ref.scrollTop) {
        ref.scrollTop = pos.top - additionalOffset
      }
      if (bot > ref.scrollTop + ref.clientHeight) {
        ref.scrollTop = ref.clientHeight - h
      }
    }
  }

  setContainerRef = (ref?: HTMLDivElement) => {
    if (ref) {
      this.containerRef = ref
      const { outerRef } = this.props
      if (outerRef) {
        if (typeof outerRef === 'function') {
          outerRef(ref)
        } else if (outerRef.hasOwnProperty('current')) {
          outerRef.current = outerRef
        }
      }
    }
  }

  getContainerRef(): HTMLDivElement | null {
    return this.containerRef
  }

  componentDidMount() {
    this.queueMeasurements()
    // if onMount we didn't add any measurements then we've successfully calculated all row sizes
    if (this.measureQueue.size === 0) {
      this.onMount()
    }
  }

  componentDidUpdate(prevProps: DynamicListProps) {
    if (
      prevProps.itemCount !== this.props.itemCount ||
      prevProps.itemData !== this.props.itemData
    ) {
      this.queueMeasurements()
    }
    const shouldMeasure = this.state.shouldMeasure
    if (shouldMeasure) {
      this.onResize()
    }
  }

  onMount() {
    this.setState(state => {
      if (state.mounted === false && this.props.onMount != null) {
        this.props.onMount()
      }
      return { mounted: true }
    })
  }

  getContentHeight() {
    let height = 0
    for (let i = 0; i < this.props.itemCount; i++) {
      const key = this.props.keyMapper(i)
      if (this.dimensions.has(key)) {
        height += this.dimensions.get(key).height
      }
      if (height > this.props.maxHeight) {
        height = this.props.maxHeight
        break
      }
    }
    return height
  }

  // called when the window is resized, we recalculate the positions and visibility of rows
  onResize = () => {
    if (this.props.height === 'content-height') {
      this.setState({ height: this.getContentHeight() })
    } else {
      this.setState({ shouldMeasure: false })
    }
    this.recalculateScrollTop()
    this.dimensions.clear()
    this.queueMeasurements()
    this.recalculateVisibleRows()
  }

  recalculateScrollTop() {
    const container = this.getContainerRef()
    if (container) {
      this.setState({
        scrollTop: container.scrollTop,
      })
    }
  }

  queueMeasurements() {
    const { props } = this
    // create measurements for new rows
    for (let i = 0; i < props.itemCount; i++) {
      const key = props.keyMapper(i)
      if (this.dimensions.has(key)) {
        continue
      }

      const precalculated = props.itemSize ? props.itemSize(i) : null

      if (precalculated) {
        this.dimensions.set(key, precalculated)
        continue
      }

      this.measureQueue.set(
        key,
        props.children({
          index: i,
          style: {
            visibility: 'hidden',
          },
        }),
      )
    }

    // recalculate the visibility and positions of all rows
    this.recalculatePositions()
    this.recalculateVisibleRows()
  }

  recalculateVisibleRows = () => {
    const { props } = this
    // @ts-ignore
    this.setState(state => {
      let startTop = 0
      // find the start index
      let startIndex = 0
      let scrollTop = state.scrollTop
      do {
        const index = this.topPositionToIndex.get(scrollTop)
        if (index != null) {
          const startPos = this.positions.get(index)
          if (startPos != null) {
            startTop = startPos.top
            startIndex = index
            break
          }
        }
        scrollTop--
      } while (scrollTop > 0)

      // find the end index
      let endIndex = startIndex
      let scrollBottom = state.scrollTop + state.height

      while (true) {
        // if the scrollBottom is equal to the height of the scrollable area then
        // we were unable to find the end index because we're at the bottom of the
        // list
        if (scrollBottom >= state.scrollHeight) {
          endIndex = props.itemCount - 1
          break
        }
        const index = this.topPositionToIndex.get(scrollBottom)
        if (index != null) {
          endIndex = index
          break
        }
        scrollBottom++
      }

      if (
        startIndex === state.startIndex &&
        endIndex === state.endIndex &&
        startTop === state.containerStyle.top
      ) {
        // this is to ensure that we don't create a new containerStyle object and obey reference equality for purity checks
        return {}
      }

      const sideScrollable = props.sideScrollable || false

      return {
        startIndex,
        endIndex,
        containerStyle: sideScrollable
          ? {
              position: 'absolute',
              top: startTop,
              left: 0,
              minWidth: '100%',
            }
          : {
              position: 'absolute',
              top: startTop,
              right: 0,
              left: 0,
            },
      }
    })
  }

  getRowDims: { [key: string]: GetDimensions } = {}

  updateRowHeight(key: string) {
    const row = this.getRowDims[key]
    if (!row) return
    const dim = row()
    if (isEqual(dim, this.dimensions.get(key))) {
      return
    }
    this.dimensions.set(key, dim)
  }

  onRowMount = (key: string, getDims: GetDimensions) => {
    this.getRowDims[key] = getDims
    this.updateRowHeight(key)
    this.measureQueue.delete(key)
    if (this.measureQueue.size === 0) {
      this.recalculatePositions()
      if (this.state.mounted === false) {
        // we triggered measurements on componentDidMount and they're now complete!
        this.onMount()
      }
    }
  }

  curY = 0

  handleScroll = e => {
    const prevY = this.curY
    const nextY = e.scrollTop
    this.curY = nextY

    // recalcualte visible rows
    const ref = this.getContainerRef()
    if (ref != null) {
      this.setState({
        scrollTop: ref.scrollTop,
      })
      this.recalculateVisibleRows()
      this.props.onScroll &&
        this.props.onScroll({
          scrollDirection: prevY < nextY ? 'forward' : 'backward',
          clientHeight: ref.clientHeight,
          scrollHeight: ref.scrollHeight,
          scrollTop: ref.scrollTop,
        })
    }
  }

  recalculatePositions() {
    const { props } = this
    this.positions.clear()
    this.topPositionToIndex.clear()
    let top = 0
    for (let i = 0; i < props.itemCount; i++) {
      const key = props.keyMapper(i)
      const dim = this.dimensions.get(key)
      if (dim == null) {
        continue
      }
      this.positions.set(i, {
        top,
        style: {
          // width: dim.width,
          height: dim.height,
        },
      })
      this.topPositionToIndex.set(top, i)
      top += dim.height
    }
    if (isNaN(top)) {
      console.warn('bad top')
      debugger
      return
    }
    this.setState({
      scrollHeight: top,
      innerStyle: {
        height: top,
        overflow: 'visibile',
        position: 'relative',
      },
    })
  }

  render() {
    // add elements to be measured
    const measureChildren: JSX.Element[] = []
    for (const [key, value] of this.measureQueue) {
      measureChildren.push(
        <NodeMeasure key={key} id={key} onMount={this.onRowMount}>
          {value}
        </NodeMeasure>,
      )
    }

    // add visible rows
    const children: Record<string, any>[] = []
    for (let i = this.state.startIndex; i <= this.state.endIndex; i++) {
      const pos = this.positions.get(i)
      if (pos == null) {
        continue
      }

      children.push(
        this.props.children({
          index: i,
          style: pos.style,
        }),
      )
    }

    return (
      <DynamicListContainer ref={this.setContainerRef} onScroll={this.handleScroll}>
        <div style={this.state.innerStyle}>
          <div style={this.state.containerStyle}>{children}</div>
        </div>
        {measureChildren}
      </DynamicListContainer>
    )
  }
}

type GetDimensions = () => {
  width: number
  height: number
}

const NodeMeasure = memo(
  (props: { id: string; onMount: (key: string, ref: GetDimensions) => void; children: any }) => {
    const contentsRef = useRef<HTMLDivElement>(null)
    useOnMount(() => {
      props.onMount(props.id, () => {
        const children = Array.from(contentsRef.current.childNodes) as HTMLElement[]
        let res = { width: 0, height: 0 }
        for (const child of children) {
          res.height += child.clientHeight
          res.width += child.clientWidth
        }
        return res
      })
    })
    return <Contents ref={contentsRef}>{props.children}</Contents>
  },
)

const DynamicListContainer = gloss({
  flex: 1,
  position: 'relative',
  overflow: 'auto',
  width: '100%',
  height: '100%',
})
