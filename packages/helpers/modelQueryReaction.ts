import { react, ReactionOptions } from '@mcro/automagical'
import { now } from 'mobx-utils'
import { modelEqual, modelsEqual } from './modelsEqual'
import * as _ from 'lodash'

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
    // because these poll all the time
    log: false,
    ...options,
  }
  let currentVal
  return react(
    () => [condition(), now(poll)],
    async ([condition]) => {
      if (!condition) {
        throw react.cancel
      }
      const next = await query()
      if (next && currentVal) {
        if (Array.isArray(next)) {
          if (modelsEqual(currentVal, next)) {
            throw react.cancel
          }
        } else if (_.isEqual(currentVal, next)) {
          throw react.cancel
        } else if (modelEqual(currentVal, next)) {
          throw react.cancel
        }
      }
      if (typeof next === 'undefined') {
        throw react.cancel
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
