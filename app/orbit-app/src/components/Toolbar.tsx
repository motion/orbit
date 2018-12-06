import { useContext, useEffect } from 'react'
import { StoreContext } from '@mcro/black'

export const Toolbar = props => {
  const stores = useContext(StoreContext)

  useEffect(() => {
    if (stores.appStore) {
      stores.appStore.setToolbar(props.children)
    }
  }, [])

  if (stores.appStore) {
    return null
  } else {
    return props.children
  }
}
