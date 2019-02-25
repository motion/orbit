import { isEqual } from '@mcro/fast-compare'
import { CompositeDisposable } from 'event-kit'
import { useEffect, useRef, useState } from 'react'
import { createReaction } from './createReaction'
import { ReactionFn, ReactVal, UnwrapObservable } from './react'
import { ReactionOptions } from './types'
import { useCurrentComponent } from './useCurrentComponent'

type MountArgs = any[]

// single reaction "autorun" style
// react(() => 1, { ...opts })
export function useReaction<A extends ReactVal, B>(
  a: ReactionFn<A, B>,
  b?: ReactionOptions | MountArgs,
  c?: MountArgs,
): UnwrapObservable<B>

// derive first, then react "reaction" style
// react(() => now(), t => t - 1000, { ...opts })
export function useReaction<A extends ReactVal, B>(
  a: (() => A),
  b?: ReactionFn<A, B>,
  c?: ReactionOptions | MountArgs,
  d?: MountArgs,
): UnwrapObservable<B>

// handles a variety of arguments:
// useReaction(() => derive, () => react, { ...options }, [mountArgs])
// useReaction(() => derive, () => react, { ...options })
// useReaction(() => derive, () => react, [mountArgs])
// useReaction(() => react, { ...options }, [mountArgs])
// useReaction(() => react, [mountArgs])
// useReaction(() => react)

export function useReaction(a: any, b?: any, c?: any, d?: any) {
  // 1 argument
  // autorun
  if (!b) {
    return setupReact(a, null, null, null)
  }

  // 4 arguments
  if (!!d) {
    if (Array.isArray(d)) {
      return setupReact(a, b, c, d)
    } else {
      throw new Error(`Bad arguments for reaction`)
    }
  }

  const bIsOptions = b.constructor.name === 'Object'
  const bIsReaction = typeof b === 'function'

  // 2 arguments
  if (!c) {
    // autorun + options
    if (bIsOptions) {
      return setupReact(a, null, b, null)
    }
    // reaction
    if (bIsReaction) {
      return setupReact(a, b, null, null)
    }
    // autorun + mountArgs
    if (Array.isArray(b)) {
      return setupReact(a, null, null, b)
    }
  }

  const cIsOptions = c.constructor.name === 'Object'

  // 3 arguments
  if (!!c) {
    if (Array.isArray(c)) {
      if (bIsReaction) {
        return setupReact(a, b, null, c)
      }
      // autorun + options + mountArgs
      if (bIsOptions) {
        return setupReact(a, null, b, c)
      }
    }
    if (cIsOptions) {
      return setupReact(a, b, c, null)
    }
  } else {
    throw new Error(`Invalid arguments for reaction`)
  }
}

// watches values in an autorun, and resolves their results
export function setupReact(
  reaction: any,
  derive: Function | null,
  opts: ReactionOptions,
  mountArgs: any[] | null,
) {
  const component = useCurrentComponent()
  const state = useRef(opts ? opts.defaultValue : undefined)
  const forceUpdate = useState(0)[1]
  const subscriptions = useRef<CompositeDisposable | null>(null)
  const firstMount = useRef(true)

  // use ref / start synchronously so we can use them without a bunch of re-renders,
  // sometimes... sometimes not :( see: https://github.com/mobxjs/mobx/issues/1911
  if (!subscriptions.current) {
    subscriptions.current = new CompositeDisposable()
    // first run, create immediately
    createReaction(
      reaction,
      derive,
      { log: false, ...opts },
      {
        name: component.renderName,
        nameFull: component.renderName,
        addSubscription(dispose) {
          subscriptions.current.add({ dispose })
        },
        setValue(next: any) {
          if (next === undefined || next === state.current) {
            return
          }
          state.current = next
          forceUpdate(Math.random())
        },
        getValue: () => state.current,
      },
    )
  }

  useEffect(() => {
    if (firstMount.current) {
      firstMount.current = false
    } else {
      // we have new mountArgs after first run, update

      // remove old reaction
      subscriptions.current.dispose()

      console.log('got new mount args!!!!!!! rerunning', mountArgs)

      // create new one
      createReaction(
        reaction,
        derive,
        { log: false, ...opts },
        {
          name: component.renderName,
          nameFull: component.renderName,
          addSubscription(dispose) {
            subscriptions.current.add({ dispose })
          },
          setValue(next: any) {
            if (next === undefined || isEqual(next, state.current)) {
              return
            }
            state.current = next
            forceUpdate(Math.random())
          },
          getValue: () => state.current,
        },
      )
    }

    return () => {
      subscriptions.current && subscriptions.current.dispose()
    }
  }, mountArgs || [])

  return state.current
}
