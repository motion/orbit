import { isEqual } from '@o/fast-compare'
import { debounce } from 'lodash'
import React, { DependencyList, EffectCallback } from 'react'

const { useState, useEffect, useLayoutEffect } = React

type MediaQueryObject = { [key: string]: string | number | boolean }

const camelToHyphen = (str: string) =>
  str.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`).toLowerCase()

const objectToString = (query: string | MediaQueryObject) => {
  if (typeof query === 'string') return query
  return Object.entries(query)
    .map(([feature, value]) => {
      feature = camelToHyphen(feature)
      if (typeof value === 'boolean') {
        return value ? feature : `not ${feature}`
      }
      if (typeof value === 'number' && /[height|width]$/.test(feature)) {
        value = `${value}px`
      }
      return `(${feature}: ${value})`
    })
    .join(' and ')
}

type Effect = (effect: EffectCallback, deps?: DependencyList) => void
const createUseMedia = (effect: Effect) => (...rawQueries: (string | MediaQueryObject)[]) => {
  const queries = rawQueries.map(objectToString)
  const [state, setState] = useState(queries.map(query => !!window.matchMedia(query).matches))

  effect(() => {
    let mounted = true
    const mqls = queries.map(query => window.matchMedia(query))

    let last
    const update = () => {
      const next = mqls.map(x => !!x.matches)
      if (!isEqual(next, last)) {
        setState(next)
        last = next
      }
    }

    const onChange = debounce(() => {
      if (!mounted) return
      update()
    })

    mqls.forEach(mql => mql.addListener(onChange))
    update()

    return () => {
      mounted = false
      mqls.forEach(x => x.removeListener(onChange))
    }
  }, [JSON.stringify(rawQueries)])

  return state
}

export const useMedia = createUseMedia(useEffect)
export const useMediaLayout = createUseMedia(useLayoutEffect)
