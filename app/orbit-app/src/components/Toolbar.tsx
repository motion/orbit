import * as React from 'react'
import { useEffect } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { gloss } from '@mcro/gloss'

export const Toolbar = props => {
  const stores = useStoresSafe()
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

const ToolbarChrome = gloss({
  flexFlow: 'row',
  alignItems: 'center',
  padding: [3, '10%'],
}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColor.alpha(0.2)],
}))
