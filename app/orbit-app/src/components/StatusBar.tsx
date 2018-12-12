import { useContext, useEffect } from 'react'
import { StoreContext } from '@mcro/black'

export const StatusBar = props => {
  const stores = useContext(StoreContext)
  const children = props.children

  // this will do something a bit odd,
  // if theres an appStore, it just passes it up
  // if not it will render it directly
  // this lets us have childrens that can be place differently depending on their use

  useEffect(() => {
    if (stores.appStore) {
      stores.appStore.setStatusBar(children)
    }
  }, [])

  if (stores.appStore) {
    return null
  } else {
    return children
  }
}
