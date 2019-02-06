import { useStore } from '@mcro/use-store'
import { useObserver } from 'mobx-react-lite'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { MergeContext } from '../views/MergeContext'

type ToolbarContextItem = {
  before?: any
  center?: any
  after?: any
  children?: any
}

export const OrbitToolBarContext = createContext({ toolbarStore: null as ToolbarStore })

class ToolbarStore {
  bars = {}
  setBars = (id, val) => {
    this.bars = {
      ...this.bars,
      [id]: val,
    }
  }
}

export function OrbitToolBarProvider(props: { children: React.ReactNode }) {
  const toolbarStore = useStore(ToolbarStore)
  return (
    <MergeContext Context={OrbitToolBarContext} value={{ toolbarStore }}>
      {props.children}
    </MergeContext>
  )
}

export function OrbitToolbar(props: ToolbarContextItem) {
  const { toolbarStore } = useContext(OrbitToolBarContext)
  const { appStore } = useStoresSafe()
  const lastProps = useRef(null)
  const id = `${appStore.id}`

  useEffect(
    () => {
      if (!isEqual(lastProps.current, props)) {
        lastProps.current = props
        toolbarStore.setBars(id, props)
      }
    },
    [props],
  )

  useEffect(() => {
    return () => {
      toolbarStore.setBars(id, null)
    }
  }, [])

  return null
}

export function useOrbitToolbars() {
  const { orbitStore } = useStoresSafe()
  const { toolbarStore } = useContext(OrbitToolBarContext)
  const [bars, setBars] = useState<ToolbarContextItem | false>(false)

  useObserver(() => {
    const next = toolbarStore.bars[orbitStore.activePane.id] || false
    if (!isEqual(bars, next)) {
      setBars(next)
    }
  })

  return bars
}
