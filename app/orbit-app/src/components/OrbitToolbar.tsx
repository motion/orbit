import { useObserver } from 'mobx-react-lite'
import React, { createContext, useContext, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { MergeContext } from '../views/MergeContext'

type ToolbarContextItem = {
  before?: any
  center?: any
  after?: any
}

type ToolbarContextValue = {
  setToolbar: (id: number, toolbar: React.ReactNode) => void
  toolbars: {
    [key: string]: ToolbarContextItem
  }
}

export const OrbitToolBarContext = createContext({
  setToolbar: null,
  toolbars: {},
} as ToolbarContextValue)

export function OrbitToolBarProvider(props: { children: React.ReactNode }) {
  const [toolbars, setToolbars] = useState({})
  return (
    <MergeContext
      Context={OrbitToolBarContext}
      value={{
        toolbars,
        setToolbar(id, value) {
          setToolbars({
            ...toolbars,
            [id]: value,
          })
        },
      }}
    >
      {props.children}
    </MergeContext>
  )
}

export function OrbitToolbar(props: ToolbarContextItem) {
  const { setToolbar } = useContext(OrbitToolBarContext)
  const { appStore } = useStoresSafe()

  useEffect(
    () => {
      setToolbar(+appStore.id, props)
      return () => {
        setToolbar(+appStore.id, null)
      }
    },
    [props.before, props.after, props.center],
  )

  return null
}

export function useOrbitToolbars() {
  const { orbitStore } = useStoresSafe()
  const { toolbars } = useContext(OrbitToolBarContext)
  const [bars, setBars] = useState<ToolbarContextItem | false>(false)

  useObserver(() => {
    const appStore = orbitStore.appStores[orbitStore.activePane.id]
    const next = (appStore && toolbars[appStore.id]) || false
    if (!isEqual(bars, next)) {
      setBars(next)
    }
  })

  return bars
}
