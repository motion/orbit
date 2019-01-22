import { useEffect } from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'

export const Toolbar = props => {
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
