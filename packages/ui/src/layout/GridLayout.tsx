import { gloss, View, ViewProps } from '@o/gloss'
import { createStoreContext, react, shallow, useStore } from '@o/use-store'
import _ from 'lodash'
import React, { Children, cloneElement, isValidElement, useEffect } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import './GridLayout.css'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

export type GridLayoutProps = {
  children?: React.ReactNode[]
  cols?: number
  rowHeight?: 100
}

class GridStore {
  props: GridLayoutProps

  items: { [key: string]: GridItemProps } = shallow({})
  layouts = {
    lg: null,
  }

  updateLayout = react(
    () => this.items,
    async (items, { sleep }) => {
      await sleep(100)
      this.layouts = {
        lg: Object.keys(items).map((key, i) => {
          const item = items[key]
          var y = Math.ceil(Math.random() * 4) + 1
          return {
            x: (_.random(0, 5) * 2) % 12,
            y: Math.floor(i / 6) * y,
            w: item.w || 2,
            h: item.h || 1,
            i: key,
            // static: Math.random() < 0.05,
          }
        }),
      }
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

export function GridLayout(props: GridLayoutProps) {
  const gridStore = useStore(GridStore, props)

  let children = null

  if (!gridStore.layouts.lg) {
    children = props.children
  } else {
    children = (
      <ResponsiveReactGridLayout
        onLayoutChange={x => console.log(x)}
        compactType="vertical"
        layouts={gridStore.layouts}
        measureBeforeMount={false}
        cols={{
          xxs: 1,
          xs: 2,
          sm: 2,
          md: 4,
          lg: 6,
        }}
      >
        {Children.map(
          props.children,
          child =>
            isValidElement(child) && (
              <div key={child.key}>{cloneElement(child as any, { id: `${child.key}` })}</div>
            ),
        )}
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
  const props = { h, w }
  useEffect(() => {
    store.mountItem(id, props)
    return () => {
      store.unmountItem(id)
    }
  }, [])

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
