import { configureUseStore, debugUseStore } from '@o/use-store'
import root from 'global'

configureUseStore({
  debugStoreState: true,
})

debugUseStore(event => {
  if (event.type === 'state') {
    root.stores = event.value
  }
})
