export * from '@mcro/automagical'
export { on } from '@mcro/helpers'
export * from './helpers/log'
export * from './helpers/mobx'
export { store } from './storeDecorator'
import { observable } from 'mobx'
import * as Constants_ from './constants'
export const Constants = Constants_
export const sleep = ms => new Promise(res => setTimeout(res, ms))

export const deep = <X>(x: X) => {
  return (observable(x) as unknown) as X
}

export const shallow = <X>(x: X) => {
  return (observable.object(x, null, { deep: false }) as unknown) as X
}
