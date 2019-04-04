import { gloss, View, ViewProps } from '@o/gloss'
import { createStoreContext, react, shallow, useStore } from '@o/use-store'
import React, { cloneElement, isValidElement, useEffect } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
// import 'react-grid-layout/css/styles.css'
// todo(nate) we can't have css imports in code because they break node when they are imported on the desktop side
import { useDefaultProps } from '../hooks/useDefaultProps'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

export type GridLayoutProps = {
  children?: React.ReactNode[]
  cols?: Object
  rowHeight?: 100
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
  const props = useDefaultProps(directProps, defaultProps)
  const gridStore = useStore(GridStore, props)
  if (!Array.isArray(props.children)) {
    throw new Error('Need an array of items...')
  }
  const childArr = [...props.children]
  const gridItems = childArr.map(
    child =>
      isValidElement(child) && (
        <div key={child.key}>{cloneElement(child as any, { id: `${child.key}` })}</div>
      ),
  )
  let children = null

  console.log('gridStore.layouts.lg', gridStore.layouts.lg, gridItems)

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

// function generateLayout() {
//   return _.map(_.range(0, 25), function(_item, i) {
//     var y = Math.ceil(Math.random() * 4) + 1
//     return {
//       x: (_.random(0, 5) * 2) % 12,
//       y: Math.floor(i / 6) * y,
//       w: 2,
//       h: y,
//       i: i.toString(),
//       // static: Math.random() < 0.05,
//     }
//   })
// }
