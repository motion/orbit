import { useContext } from 'react'
import { StoreContext } from '@mcro/black'

export const Toolbar = props => {
  const stores = useContext(StoreContext)
  if (stores.appStore) {
    stores.appStore.setToolbar(props.children)
    return null
  }
  return props.children
}
