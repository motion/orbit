export * from '@mcro/automagical'
export * from './helpers/log'
export * from './helpers/mobx'
export * from './storeDecorator'
export const sleep = ms => new Promise(res => setTimeout(res, ms))
