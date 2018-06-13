import { react, ReactionOptions } from '@mcro/automagical'
import { now } from 'mobx-utils'
import * as EventKit from 'event-kit'
export * from './events'
export * from './ref'

export { Helpers } from './types'
export const { CompositeDisposable } = EventKit

export const sleep = ms => new Promise(res => setTimeout(res, ms))
export const idFn = _ => _

import { comparer } from 'mobx'
export const isEqual = comparer.structural

type ReactModelQueryOpts = ReactionOptions & {
  condition: Function
  poll?: number
}

const trueFn = () => true

// a helper to watch model queries and only trigger reactions when the model changes
// because our models dont implement a nice comparison, which we could probably do later
export function modelQueryReaction(query, b, c?: ReactModelQueryOpts) {
  let options = b
  let returnVal = null
  if (typeof b === 'function') {
    returnVal = b
    options = c
  }
  const condition = (options && options.condition) || trueFn
  const poll = (options && options.poll) || 2000
  const finalOptions = {
    defaultValue: [],
    log: false,
    ...options,
  }
  let currentVal
  return react(
    () => condition() && now(poll || 2000),
    async () => {
      const next = await query()
      if (next && currentVal) {
        if (Array.isArray(next)) {
          if (modelsEqual(currentVal, next)) {
            throw react.cancel
          }
        } else if (modelEqual(currentVal, next)) {
          throw react.cancel
        }
      }
      currentVal = next
      // if given explicit reaction, use that as return val
      if (returnVal) {
        const res = returnVal(next)
        if (res instanceof Promise) {
          return await res
        }
        return res
      }
      // else just return the new models
      return next
    },
    finalOptions,
  )
}

export function watchModel(
  Model: any,
  where: Object,
  onChange: Function,
  options?,
) {
  const { interval = 1000 } = options || {}
  let setting
  let refreshInterval
  Model.findOne({ where }).then(first => {
    setting = first
    if (setting) {
      onChange(setting)
    }
    refreshInterval = setInterval(async () => {
      const next = await Model.findOne({ where })
      if (!next) {
        return
      }
      if (!setting) {
        setting = next
        onChange(setting)
        return
      }
      if (Date.parse(next.updatedAt) === Date.parse(setting.updatedAt)) {
        return
      }
      setting = next
      onChange(setting)
    }, interval)
  })
  return {
    cancel: () => {
      clearInterval(refreshInterval)
    },
  }
}

export function modelsEqual(a: any[], b: any[], keys?) {
  if (a.length !== b.length) {
    return false
  }
  for (const [index, aItem] of a.entries()) {
    if (!modelEqual(aItem, b[index], keys)) {
      return false
    }
  }
  return true
}

// compare model
export function modelEqual(a: any, b: any, keys = ['updatedAt']) {
  const aKeys = Object.keys(a)
  const bKeys = Object.keys(b)
  if (!isEqual(aKeys, bKeys)) {
    return false
  }
  for (const key of aKeys) {
    if (keys.indexOf(key) === -1) {
      continue
    }
    if (!isEqual(b[key], a[key])) {
      return false
    }
  }
  return true
}
