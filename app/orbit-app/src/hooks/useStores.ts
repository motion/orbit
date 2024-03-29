import { createUseStores } from '@o/use-store'
import { useContext } from 'react'

import { AllStores, StoreContext } from '../StoreContext'

type GuaranteedAllStores = { [P in keyof AllStores]-?: AllStores[P] }

export const useStores = createUseStores<GuaranteedAllStores>(
  () => useContext(StoreContext) as GuaranteedAllStores,
)

export const useStoresSimple = () => {
  // resetTracking()
  return useContext(StoreContext)
}
