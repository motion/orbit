import { gloss, View } from '@mcro/gloss'
import { observer } from 'mobx-react-lite'
import React, { useEffect } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'

export function OrbitToolbar(props) {
  const stores = useStoresSafe()
  const toolbar = props.children

  // this will do something a bit odd,
  // if theres an appStore, it just passes it up
  // if not it will render it directly
  // this lets us have toolbars that can be place differently depending on their use

  useEffect(() => {
    if (stores.appStore) {
      stores.appStore.setToolbar(toolbar)
    }
  }, [])

  if (stores.appStore) {
    return null
  } else {
    return toolbar
  }
}

export const OrbitToolBarRender = observer(function OrbitToolBarProvide() {
  const { orbitStore } = useStoresSafe()
  const appStore = orbitStore.appStores[orbitStore.activePane.id]
  if (!appStore || !appStore.toolbar) {
    return null
  }
  return <ToolbarChrome>{appStore.toolbar}</ToolbarChrome>
})

const ToolbarChrome = gloss(View, {
  flexFlow: 'row',
  alignItems: 'center',
  padding: [4, 10],
}).theme((_, theme) => ({
  background: theme.tabBackground,
  borderBottom: [1, theme.borderColor.alpha(0.2)],
}))
