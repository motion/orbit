import { Contents, gloss } from '@o/gloss'
import { createStoreContext, react, shallow, useStore } from '@o/use-store'
import React, { cloneElement, HTMLAttributes, isValidElement, memo, useCallback, useEffect } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'

import { isBrowser } from '../constants'
import { isRightClick } from '../helpers/isRightClick'
import { useDefaultProps } from '../hooks/useDefaultProps'
import { useParentNodeSize } from '../hooks/useParentNodeSize'
import { SizedSurfaceProps } from '../SizedSurface'

const ResponsiveGridLayout = WidthProvider(Responsive)

if (isBrowser) {
  // original
  require('./react-grid-layout.css')
  // our overrides
  require('./react-grid-layout-styles.css')
}

export type GridLayoutProps = GridLayoutPropsControlled | GridLayoutPropsObject

type Base = { cols?: Object }
type GridLayoutPropsObject = Base & {
  items: any[]
  renderItem: (a: any, index: number) => React.ReactNode
}
type GridLayoutPropsControlled = Base & {
  children?: React.ReactNode
}

const defaultProps: Partial<GridLayoutProps> = {
  cols: {
    xxs: 1,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 4,
  },
}

class GridStore {
  props: GridLayoutProps

  items: { [key: string]: GridItemProps } = shallow({})
  layout = 'lg'
  layouts = {
    lg: null,
  }
  breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }
  width = window.innerWidth

  setItems = (items: { [key: string]: GridItemProps }) => {
    for (const key in items) {
      this.items[key] = items[key]
    }
  }

  setWidth = (next: number) => {
    this.width = next
  }

  get currentLayout() {
    return Object.keys(this.breakpoints).reduce((a, key) => {
      const val = this.breakpoints[key]
      if (this.width > val && val > this.breakpoints[a]) {
        return key
      }
      return a
    }, 'xxs')
  }

  setLayout = (layout: any[], width?: number) => {
    if (width) {
      this.width = width
    }
    this.layouts = {
      ...this.layouts,
      [this.currentLayout]: layout,
    }
  }

  updateLayout = react(
    () => this.items,
    async (items, { sleep }) => {
      await sleep(100)
      const cols = this.props.cols[this.layout]
      if (!cols) {
        console.warn('no cols defined for layout', this.layout, this.props.cols)
        return
      }
      const layout = []
      let lastX = 0
      let lastY = 0
      for (const [idx, key] of Object.keys(items).entries()) {
        const item = items[key]
        let x = lastX + idx === 0 ? 0 : item.w + lastX
        const shouldWrap = x + item.w > cols
        if (shouldWrap) {
          x = 0
        }
        const y = x + item.w > cols ? lastY + 1 : lastY
        const next = {
          x,
          y,
          w: item.w || 2,
          h: item.h || 1,
          i: key,
          // static: Math.random() < 0.05,
        }
        lastY = y
        lastX = x
        layout.push(next)
      }
      console.log('setting layout', cols, layout)
      this.setLayout(layout)
    },
  )

  mountItem(id: string, props: GridItemProps) {
    this.items[id] = props
  }

  unmountItem(id: string) {
    delete this.items[id]
  }
}

// this is the problem function, type is off
const { useStore: useGridStore, SimpleProvider } = createStoreContext(GridStore)

export const GridLayout = memo(function GridLayout(directProps: GridLayoutProps) {
  const props = useDefaultProps(defaultProps, directProps)

  // TODO not great pattern here... maybe remove first option

  if ('items' in props) {
    return <GridLayoutObject {...props} />
  }
  return <GridLayoutChildren {...props} />
})

export function GridLayoutChildren(props: GridLayoutPropsControlled) {
  const { width, ref } = useParentNodeSize()
  const gridStore = useStore(GridStore, props)
  const childArr = Array.isArray(props.children) ? props.children : [props.children]

  const items = childArr
    .map((child, index) => {
      if (!isValidElement(child)) {
        throw new Error(`Invalid child: ${child}, must be a React Element`)
      }
      if (!child.key) {
        console.error(
          `Child without a key given to <GridLayout /> at index ${index}, must set a key.`,
        )
        return null
      }
      // you can pass in a <GridItem />...
      const isGridItem = child.type instanceof GridItem
      if (isGridItem) {
        return <div key={child.key}>{cloneElement(child, { id: `${child.key}` } as any)}</div>
      }
      // ... or a regular item like <Card />
      return (
        <GridItem key={child.key} id={`${child.key}`}>
          {child}
        </GridItem>
      )
    })
    .filter(Boolean)

  let children = null
  if (!gridStore.layouts.lg) {
    children = <div style={{ display: 'none' }}>{items}</div>
  } else {
    children = (
      <ResponsiveGridLayout
        onLayoutChange={next => gridStore.setLayout(next, width)}
        layouts={gridStore.layouts}
        breakpoints={gridStore.breakpoints}
        width={width}
        compactType="vertical"
        measureBeforeMount={false}
        draggableHandle=".grid-draggable"
        cols={props.cols}
      >
        {items}
      </ResponsiveGridLayout>
    )
  }
  return (
    <Contents ref={ref}>
      <SimpleProvider value={gridStore}>{children}</SimpleProvider>
    </Contents>
  )
}

const getSizes = items => {
  const sizes = {}
  for (const [index] of items.entries()) {
    sizes[index] = { w: 1, h: 1 }
  }
  return sizes
}

function GridLayoutObject(props: GridLayoutPropsObject) {
  const gridStore = useStore(GridStore, props)
  const items = props.items.map((item, idx) => <div key={idx}>{props.renderItem(item, idx)}</div>)
  const sizes = getSizes(props.items)

  useEffect(() => {
    console.log('set sizes')
    gridStore.setItems(sizes)
  }, [JSON.stringify(sizes)])

  if (!gridStore.layouts.lg) {
    return null
  }

  return (
    <Responsive
      onLayoutChange={gridStore.setLayout}
      compactType="vertical"
      layouts={gridStore.layouts}
      measureBeforeMount={false}
      cols={props.cols}
    >
      {items}
    </Responsive>
  )
}

export type GridItemProps = HTMLAttributes<HTMLDivElement> & {
  w?: number
  h?: number
}

// warning: performance is sensitive here

export function GridItem({ h = 1, w = 1, id, children, ...viewProps }: GridItemProps) {
  const store = useGridStore()
  useEffect(() => {
    const props = { h, w }
    store.mountItem(id, props)
    return () => {
      store.unmountItem(id)
    }
  }, [h, w])

  const onMouseDown = useCallback(e => isRightClick(e) && e.stopProgation(), [])

  return (
    <GridItemChrome onMouseDown={onMouseDown} {...viewProps}>
      {forwardSurfaceProps(children, { flex: 1 })}
    </GridItemChrome>
  )
}

const GridItemChrome = gloss({
  flex: 1,
})

GridItem.isGridItem = true

// TODO this could be a pattern

function forwardSurfaceProps(children: any, props: SizedSurfaceProps) {
  if (children && children.type && children.type.accepts && children.type.accepts.surfaceProps) {
    return cloneElement(children, props)
  }
  return children
}
