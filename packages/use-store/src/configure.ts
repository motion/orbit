import { createContext } from 'react'

type UseStoreConfiguration = {
  onMount?: (store: any) => void
  onUnmount?: (store: any) => void
  context?: React.Context<any>
  debugStoreState?: boolean
}

export let config: UseStoreConfiguration = {
  onMount: null,
  onUnmount: null,
  context: createContext(null),
  debugStoreState: false,
}

export const configureUseStore = (opts: UseStoreConfiguration) => {
  config = Object.freeze({
    ...config,
    ...opts,
  })
}
