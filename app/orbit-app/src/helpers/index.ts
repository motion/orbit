import { toJS } from 'mobx'

export const stringify = x => JSON.stringify(toJS(x))

export const wordKey = word => word.join('-')

export const deepClone = obj => (obj ? JSON.parse(JSON.stringify(obj)) : obj)

export const getSlackDate = (time: number) => new Date(time)

export const sleep = ms => new Promise(res => setTimeout(res, ms))

export const getHeader = (message, key) => message.participants.find(x => x.type === key)
