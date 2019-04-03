import { View, ViewProps } from '@o/gloss'
import { createStoreContext, deep, useStore } from '@o/use-store'
import _ from 'lodash'
import React, { useEffect, useRef } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import './GridLayout.css'

const ResponsiveReactGridLayout = WidthProvider(Responsive)

export type GridLayoutProps = {
  children?: React.ReactNode
  cols?: number
  rowHeight?: 100
}

class GridStore {
  props: GridLayoutProps

  items: { [key: string]: GridItemProps } = deep({})

  layouts = {
    lg: generateLayout(),
  }

  mountItem(id: number, props: GridItemProps) {
    this.items[id] = props
  }

  unmountItem(id: number) {
    delete this.items[id]
  }
}

// this is the problem function, type is off
const GridStoreContext = createStoreContext(GridStore)

export function GridLayout({ children, ...props }: GridLayoutProps) {
  const gridStore = useStore(GridStore, props)
  console.log('gridStore', gridStore.layouts.lg)

  function generateDOM() {
    return _.map(gridStore.layouts.lg, function(l, i) {
      return (
        <div key={i}>
          {l.static ? (
            <span className="text" title="This item is static and cannot be removed or resized.">
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      )
    })
  }

  return (
    <GridStoreContext.Provider value={gridStore}>
      <ResponsiveReactGridLayout
        onLayoutChange={x => console.log(x)}
        compactType="vertical"
        layouts={gridStore.layouts}
        measureBeforeMount={false}
      >
        {generateDOM()}
      </ResponsiveReactGridLayout>
    </GridStoreContext.Provider>
  )
}

export type GridItemProps = ViewProps & {
  rowSpan?: number
  colSpan?: number
}

export function GridItem({ colSpan = 1, rowSpan = 1, ...viewProps }: GridItemProps) {
  const store = GridStoreContext.useStore()
  const id = useRef(Math.random()).current
  const props = { colSpan, rowSpan }

  useEffect(() => {
    store.mountItem(id, props)
    return () => {
      store.unmountItem(id)
    }
  }, [])

  return <View flex={1} {...viewProps} />
}

function generateLayout() {
  return _.map(_.range(0, 25), function(_item, i) {
    var y = Math.ceil(Math.random() * 4) + 1
    return {
      x: (_.random(0, 5) * 2) % 12,
      y: Math.floor(i / 6) * y,
      w: 2,
      h: y,
      i: i.toString(),
      static: Math.random() < 0.05,
    }
  })
}
