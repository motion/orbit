import { react, ReactionOptions } from '@mcro/automagical'
import { now } from 'mobx-utils'
import { modelEqual, modelsEqual } from './modelsEqual'
import { comparer } from 'mobx'

type ReactModelQueryOpts = ReactionOptions & {
  condition?: () => boolean
  poll?: number
}

const trueFn = () => true
const DEFAULT_OPTIONS = {
  poll: 15000,
  condition: trueFn,
}

// a helper to watch model queries and only trigger reactions when the model changes
// because our models dont implement a nice comparison, which we could probably do later
export function modelQueryReaction(
  query: Function,
  b?: ReactModelQueryOpts | Function,
  c?: ReactModelQueryOpts,
) {
  let options: ReactModelQueryOpts | undefined
  let returnVal
  if (typeof b === 'function') {
    returnVal = b
    options = c
  } else if (b instanceof Object) {
    options = b
  }
  const { poll, condition, ...restOptions } = {
    ...DEFAULT_OPTIONS,
    ...options,
  }
  const finalOptions: ReactionOptions = {
    immediate: true,
    defaultValue: null,
    log: false,
    ...restOptions,
  }
  return react(
    () => (now(poll) && condition() ? Math.random() : null),
    async (_, { getValue }) => {
      if (!condition()) {
        throw react.cancel
      }
      const currentVal = getValue()
      let next = await query()
      if (typeof next === 'undefined') {
        throw react.cancel
      }
      // if given explicit reaction, use that as return val
      if (returnVal) {
        next = returnVal(next)
        if (next instanceof Promise) {
          next = await next
        }
      }
      if (Array.isArray(next)) {
        if (modelsEqual(currentVal, next)) {
          throw react.cancel
        }
      } else if (comparer.structural(currentVal, next)) {
        throw react.cancel
      } else if (modelEqual(currentVal, next)) {
        throw react.cancel
      }
      // else just return the new models
      return next
    },
    finalOptions,
  )
}
