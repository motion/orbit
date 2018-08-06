export * from './storeDecorator'
export * from './helpers/log'
export * from '@mcro/automagical'
export * from './helpers/mobx'
export * from './helpers/deep'
export const sleep = ms => new Promise(res => setTimeout(res, ms))
export { Store } from './classes/Store'
