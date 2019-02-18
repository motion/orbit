import { CompositeDisposable } from 'event-kit'
import { useEffect, useState } from 'react'
import { createReaction } from './createReaction'
import { ReactionFn, ReactVal, UnwrapObservable } from './react'
import { ReactionOptions } from './types'
import { useCurrentComponent } from './useCurrentComponent'

// single reaction "autorun" style
// react(() => 1, { ...opts })
export function useReaction<A extends ReactVal, B>(
  a: ReactionFn<A, B>,
  b?: ReactionOptions,
): UnwrapObservable<B>

// derive first, then react "reaction" style
// react(() => now(), t => t - 1000, { ...opts })
export function useReaction<A extends ReactVal, B>(
  a: (() => A),
  b?: ReactionFn<A, B>,
  c?: ReactionOptions,
): UnwrapObservable<B>

export function useReaction(a: any, b?: any, c?: any) {
  if (!b || b.constructor.name === 'Object') {
    return setupReact(a, null, b as ReactionOptions)
  }
  if (typeof b === 'function') {
    return setupReact(a, b, c)
  }
  throw new Error(`Bad reaction args ${a} ${b} ${c}`)
}

// watches values in an autorun, and resolves their results
export function setupReact(reaction: any, derive: Function | null, opts: ReactionOptions) {
  const component = useCurrentComponent()
  const [state, setState] = useState(null)

  useEffect(() => {
    const subscriptions = new CompositeDisposable()
    const name = `${component.renderName} [${component.renderId}] useReaction`

    createReaction(reaction, derive, opts, {
      name,
      nameFull: name,
      addSubscription(dispose) {
        subscriptions.add({ dispose })
      },
      setValue: setState,
      getValue: () => state,
    })

    return () => {
      subscriptions.dispose()
    }
  }, [])

  return state
}
