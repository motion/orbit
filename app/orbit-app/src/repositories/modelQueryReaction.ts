import { react, ReactionOptions } from '@mcro/black'
import { now } from 'mobx-utils'
import { comparer } from 'mobx'
import { Person, Bit, Setting, Job, PersonBit } from '@mcro/models'

type ReactModelQueryOpts = ReactionOptions & {
  condition?: () => boolean
  poll?: number
}

const trueFn = () => true
const DEFAULT_OPTIONS = {
  poll: 15000,
  condition: trueFn,
}

const isEqual = comparer.structural

type ValidModel = Person | Bit | Setting | PersonBit | Job

type ModelQuery<T> = (() => Promise<T>)

// a helper to watch model queries and only trigger reactions when the model changes
// because our models dont implement a nice comparison, which we could probably do later
export function modelQueryReaction<T extends ValidModel | ValidModel[]>(
  query: ModelQuery<T>,
  b?: ReactModelQueryOpts | ((a: T) => any),
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
  let currentVal
  return react(
    () => (now(poll) && condition() ? Math.random() : null),
    async (_, { setValue }) => {
      if (!condition()) {
        throw react.cancel
      }
      const next = await query()
      if (isEqual(currentVal, next)) {
        throw react.cancel
      }
      currentVal = next
      let final
      // if given explicit reaction, use that as return val
      if (returnVal) {
        const res = returnVal(next)
        if (next instanceof Promise) {
          final = await res
        } else {
          final = res
        }
      } else {
        final = next
      }
      setValue(final)
    },
    finalOptions,
  )
}
