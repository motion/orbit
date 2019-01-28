import { observer } from 'mobx-react-lite'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { MergeContext } from '../views/MergeContext'

type ToolbarContextItem = {
  before?: any
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

  useEffect(() => {
    setToolbar(appStore.id, props)
    return () => {
      setToolbar(appStore.id, null)
    }
  }, [])

  return null
}

export const OrbitToolBarRender = observer(function OrbitToolBarRender(props: {
  children: ((toolbars: ToolbarContextItem | false) => any)
}) {
  const { orbitStore } = useStoresSafe()
  const appStore = orbitStore.appStores[orbitStore.activePane.id]
  const { toolbars } = useContext(OrbitToolBarContext)
  const toolbarElements = appStore && toolbars[appStore.id] && toolbars[appStore.id]
  const hasToolbars = toolbarElements && (toolbarElements.before || toolbarElements.after)
  return props.children(hasToolbars ? toolbarElements : false)
})
