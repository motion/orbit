import { GET_STORE } from './mobxProxyWorm'

export const unwrapProxy = (store: any) => {
  return store ? store[GET_STORE] || store : store
}
