import { gloss } from '@o/gloss'
import { createStoreContext, react, shallow, useStore } from '@o/use-store'
import React, { cloneElement, isValidElement, useEffect } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import { isBrowser } from '../constants'
import { useDefaultProps } from '../hooks/useDefaultProps'
import { View, ViewProps } from '../View/View'

if (isBrowser) {
  require('react-grid-layout/css/styles.css')
}

const ResponsiveReactGridLayout = WidthProvider(Responsive)

type Base = { cols?: Object }

export type GridLayoutProps =
  | Base & {
      children?: React.ReactNode[]
    }
  | Base & {
      items: any[]
      renderItem: (a: any, index: number) => React.ReactNode
    }

const defaultProps: Partial<GridLayoutProps> = {
  cols: {
    xxs: 1,
    xs: 1,
    sm: 2,
    md: 4,
    lg: 6,
  },
}

class GridStore {
  props: GridLayoutProps

  items: { [key: string]: GridItemProps } = shallow({})
  layout = 'lg'
  layouts = {
    lg: null,
  }

  setLayout = (layout: any[]) => {
    console.log('layout', layout)
    // this.layout = layout
    this.layouts = {
      lg: layout,
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
      for (const [idx, key] of Object.keys(items).entries()) {
        const item = items[key]
        const next = {
          x: lastX + item.w,
          y: idx * item.h,
          w: item.w || 2,
          h: item.h || 1,
          i: key,
          // static: Math.random() < 0.05,
        }
        lastX = next.x
        layout.push(next)
      }
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
const { useStore: useGridStore, Provider } = createStoreContext(GridStore)

export function GridLayout(directProps: GridLayoutProps) {
  const props = useDefaultProps(defaultProps, directProps)
  const gridStore = useStore(GridStore, props)
  const items =
    'items' in props
      ? props.items.map((item, idx) => props.renderItem(item, idx))
      : [...props.children]
  const gridItems = items.map(
    child =>
      isValidElement(child) && (
        <div key={child.key}>{cloneElement(child as any, { id: `${child.key}` })}</div>
      ),
  )
  let children = null

  if (!gridStore.layouts.lg) {
    children = <div style={{ display: 'none' }}>{gridItems}</div>
  } else {
    children = (
      <ResponsiveReactGridLayout
        onLayoutChange={gridStore.setLayout}
        compactType="vertical"
        layouts={gridStore.layouts}
        measureBeforeMount={false}
        cols={props.cols}
      >
        {gridItems}
      </ResponsiveReactGridLayout>
    )
  }

  return <Provider value={gridStore}>{children}</Provider>
}

export type GridItemProps = ViewProps & {
  id?: string
  w?: number
  h?: number
}

export function GridItem({ h = 1, w = 1, id, ...viewProps }: GridItemProps) {
  const store = useGridStore()
  useEffect(() => {
    const props = { h, w }
    store.mountItem(id, props)
    return () => {
      store.unmountItem(id)
    }
  }, [h, w])

  return <GridItemChrome flex={1} {...viewProps} />
}

const GridItemChrome = gloss(View, {
  '& img': {
    userSelect: 'none',
  },
})
