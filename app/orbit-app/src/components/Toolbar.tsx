import * as React from 'react'
import { useContext, useEffect } from 'react'
import { StoreContext, view } from '@mcro/black'

export const Toolbar = props => {
  const stores = useContext(StoreContext)
  const toolbar = <ToolbarChrome>{props.children}</ToolbarChrome>

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

const ToolbarChrome = view({
  flexFlow: 'row',
  height: 38,
  alignItems: 'center',
  padding: [0, '10%'],
})
