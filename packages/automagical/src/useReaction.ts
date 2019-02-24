import { CompositeDisposable } from 'event-kit'
import { useEffect, useRef, useState } from 'react'
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
  const state = useRef(opts ? opts.defaultValue : undefined)
  const forceUpdate = useState(0)[1]
  const subscriptions = useRef<CompositeDisposable | null>(null)
  const testSync = useRef(0)
  testSync.current === 0

  // use ref / start synchronously so we can use them without a bunch of re-renders,
  // sometimes... sometimes not :( see: https://github.com/mobxjs/mobx/issues/1911
  if (!subscriptions.current) {
    subscriptions.current = new CompositeDisposable()
    let firstRun = true
    const name = `${component.renderName} useReaction`

    createReaction(reaction, derive, opts, {
      name,
      nameFull: name,
      addSubscription(dispose) {
        subscriptions.current.add({ dispose })
      },
      setValue(next: any) {
        const isSync = testSync.current === 0
        testSync.current === 2
        const wasFirstRun = firstRun
        firstRun = false
        if (next === undefined || next === state.current) {
          return
        }
        state.current = next
        // avoid double render when sync
        if (wasFirstRun && isSync) return
        forceUpdate(Math.random())
      },
      getValue: () => state.current,
    })
  }

  if (testSync.current === 0) {
    console.warn('didnt run sync')
    console.debug('reactino', reaction, derive)
  }

  testSync.current = 1

  useEffect(() => {
    return () => {
      subscriptions.current && subscriptions.current.dispose()
    }
  }, [])

  return state.current
}
