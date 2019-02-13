import { createUseStores } from '@mcro/use-store'
import { useContext } from 'react'
import { StoreContext } from '../contexts'
import { AllStores } from '../contexts/StoreContext'

type GuaranteedAllStores = { [P in keyof AllStores]-?: AllStores[P] }

export const useStores = createUseStores(StoreContext as React.Context<GuaranteedAllStores>)

export const useStoresSimple = () => useContext(StoreContext)
