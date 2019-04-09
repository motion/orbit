import { createContext } from 'react'

type UseStoreConfiguration = {
  onMount?: ((store: any) => void) | null
  onUnmount?: ((store: any) => void) | null
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
