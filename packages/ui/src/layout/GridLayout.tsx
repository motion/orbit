import { Contents, gloss } from '@o/gloss'
import { createStoreContext, ensure, react, useStore } from '@o/use-store'
import React, { cloneElement, HTMLAttributes, isValidElement, memo, useCallback, useEffect } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'

import { isBrowser } from '../constants'
import { isRightClick } from '../helpers/isRightClick'
import { useDefaultProps } from '../hooks/useDefaultProps'
import { useParentNodeSize } from '../hooks/useParentNodeSize'
import { SizedSurfaceProps } from '../SizedSurface'
import { Omit } from '../types'

const ResponsiveGridLayout = WidthProvider(Responsive)

if (isBrowser) {
  // original
  require('./react-grid-layout.css')
  // our overrides
  require('./react-grid-layout-styles.css')
}

export type GridLayoutProps = GridLayoutPropsControlled | GridLayoutPropsObject

type GridItemDimensions = {
  w?: number | 'auto'
  h?: number | 'auto'
}

type Base = { cols?: Object }
type GridLayoutPropsObject = Base & {
  items: any[]
  renderItem: (a: any, index: number) => React.ReactNode
}
type GridLayoutPropsControlled = Base & {
  children?: React.ReactNode
  height?: number
}

const defaultProps: Partial<GridLayoutProps> = {
  cols: {
    xxs: 1,
    xs: 1,
    sm: 2,
    md: 4,
    lg: 5,
  },
}

type GridItems = { [key: string]: GridItemProps }

const autoSize = (item: GridItemProps, cols: number, items: GridItems) => {
  const total = Object.keys(items).length
  console.log('total', total, items)
  let defaultSize = 1
  if (total === 1) {
    defaultSize = cols
  } else if (total <= cols / 2) {
    const n = cols / total
    defaultSize = Math.floor(n % 1 === 0 ? n : n)
  } else {
    defaultSize = cols >= 4 ? 2 : 1
  }
  const w = item.w === 'auto' ? defaultSize : item.w
  const h = item.h === 'auto' ? defaultSize : item.h
  return { w, h }
}

// attempts to position things nicely
function calculateLayout(items: GridItems, cols: number) {
  const layout = []

  let lastX = 0
  let lastY = 0
  for (const [idx, key] of Object.keys(items).entries()) {
    const item = items[key]
    const { w, h } = autoSize(item, cols, items)
    let x = lastX + idx === 0 ? 0 : w + lastX
    const shouldWrap = x + w > cols
    if (shouldWrap) {
      x = 0
    }
    const y = x + w > cols ? lastY + 1 : lastY
    const next = {
      x,
      y,
      w,
      h,
      i: key,
    }
    lastY = y
    lastX = x
    layout.push(next)
  }
  return layout
}

class GridStore {
  props: GridLayoutProps

  items: GridItems = {}
  layouts = null
  breakpoints = { lg: 1400, md: 1000, sm: 800, xs: 500, xxs: 0 }
  width = window.innerWidth

  setItems = (items: GridItems) => {
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
      ensure('items', !!Object.keys(items).length)
      await sleep(50)
      // always re-calc from large and reset
      this.layouts = {
        lg: calculateLayout(items, this.props.cols['lg']),
        // this would calc all layouts more nicely, but then when you change something it doesn't change all of them
        // so we'd need to re-calc them all when you resize/change, if we wanted that, wed need a better calculateLayout
        // md: calculateLayout(items, this.props.cols['md']),
        // sm: calculateLayout(items, this.props.cols['sm']),
        // xs: calculateLayout(items, this.props.cols['xs']),
      }
    },
  )

  mountItem(props: GridItemProps) {
    this.items = {
      ...this.items,
      [props.id]: props,
    }
  }

  unmountItem(props: GridItemProps) {
    delete this.items[props.id]
    this.items = { ...this.items }
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
  if (!gridStore.layouts) {
    children = <div style={{ display: 'none', height: props.height }}>{items}</div>
  } else {
    children = (
      <ResponsiveGridLayout
        onLayoutChange={next => gridStore.setLayout(next, width)}
        layouts={gridStore.layouts}
        breakpoints={gridStore.breakpoints}
        width={width}
        height={props.height}
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

export type GridItemProps = Omit<HTMLAttributes<HTMLDivElement>, 'id'> &
  GridItemDimensions & {
    id: string
  }

// warning: performance is sensitive here

export function GridItem(props: GridItemProps) {
  const store = useGridStore()
  useEffect(() => {
    store.mountItem(props)
    return () => {
      store.unmountItem(props)
    }
  }, [props.h, props.w, props.id])

  const onMouseDown = useCallback(e => isRightClick(e) && e.stopProgation(), [])

  return (
    <GridItemChrome onMouseDown={onMouseDown} {...props}>
      {forwardSurfaceProps(props.children, { flex: 1 })}
    </GridItemChrome>
  )
}

GridItem.defaultProps = {
  w: 'auto',
  h: 'auto',
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
