import { View, ViewProps } from '@o/gloss'
import { createStoreContext, deep, useStore } from '@o/use-store'
import React, { useEffect, useRef } from 'react'
import ReactGridLayout from 'react-grid-layout'

export type GridLayoutProps = {
  children?: React.ReactNode
  cols?: number
  rowHeight?: 100
}

class GridStore {
  props: GridLayoutProps

  items = deep({})

  get layout() {
    return [
      { i: 'a', x: 0, y: 0, w: 1, h: 2, static: true },
      { i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
      { i: 'c', x: 4, y: 0, w: 1, h: 2 },
    ]
  }

  mountItem(id: number, props: GridItemProps) {
    this.items[id] = props
  }

  unmountItem(id: number) {
    delete this.items[id]
  }
}

const GridStoreContext = createStoreContext(GridStore)

export function GridLayout({ children, ...props }: GridLayoutProps) {
  const gridStore = useStore(GridStore, props)
  return (
    <GridStoreContext.Provider value={gridStore}>
      <ReactGridLayout layout={gridStore.layout} width={window.innerWidth}>
        <div key="a">{children}</div>
      </ReactGridLayout>
    </GridStoreContext.Provider>
  )
}

export type GridItemProps = ViewProps & {
  rows?: number
  cols?: number
}

export function GridItem(props: GridItemProps) {
  const store = GridStoreContext.useStore()

  // store should be instanceof GridStore...

  const id = useRef(Math.random()).current

  useEffect(() => {
    console.log('store', store, id)
    // store.mountItem(id, props)
    return () => {
      // store.unmountItem(id)
    }
  }, [])

  return <View {...props} />
}
