import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { GlossThemeProps } from '../types'
import { CompiledTheme } from './createTheme'
import { preProcessTheme } from './preProcessTheme'
import { CurrentThemeContext } from './Theme'

// can optionally pass in props accepted by theme

type ThemeTrackState = {
  theme: CompiledTheme
  hasUsedOnlyCSSVariables: boolean
  nonCSSVariables: Set<string>
}

export function useTheme<A = {}>(props?: A): GlossThemeProps<A> {
  const themeObservable = useContext(CurrentThemeContext)
  const forceUpdate = useState(0)[1]
  const state = useRef<ThemeTrackState>()
  if (!state.current) {
    state.current = {
      theme: getTheme(themeObservable.current, props),
      hasUsedOnlyCSSVariables: true,
      nonCSSVariables: new Set(),
    }
  }
  const curTheme = state.current.theme

  const proxy = useMemo(() => {
    return createThemeProxy(curTheme, state.current!, props)
  }, [curTheme, themeObservable])

  // update fast -- may be better to put in layoutEffect
  proxy[UpdateProxySymbol] = [props, curTheme]

  useEffect(() => {
    const next = getTheme(themeObservable.current, props)
    if (next !== state.current!.theme) {
      state.current!.theme = next
      forceUpdate(Math.random())
    }

    const sub = themeObservable.subscribe(theme => {
      if (!state.current!.hasUsedOnlyCSSVariables) {
        console.warn('re-rendering because used variables', state.current?.nonCSSVariables, props)
        state.current!.theme = getTheme(theme, props)
        forceUpdate(Math.random())
      }
    })
    return sub.unsubscribe
  }, [themeObservable])

  return proxy
}

const getTheme = (theme?: CompiledTheme, props?: any) => {
  if (theme) {
    // TODO this should not go here, maybe just wrap those themes in <Theme coat={false}> or something
    if (props?.coat === false) {
      return theme.parent || theme
    } else if (props?.coat) {
      return preProcessTheme(props, theme)
    }
  }
  return theme
}

const OriginalPropsSymbol = Symbol('OriginalPropsSymbol') as any

// utility for getting original props
export const unwrapProps = <A = any>(themeProps: A): A => {
  return themeProps[OriginalPropsSymbol]
}

export const UnwrapThemeSymbol = Symbol('UnwrapTheme') as any
export const unwrapTheme = <CompiledTheme>(theme: CompiledTheme): CompiledTheme => {
  let res = theme
  while (true) {
    if (res[UnwrapThemeSymbol]) {
      res = res[UnwrapThemeSymbol]
    } else {
      break
    }
  }
  return res
}

const fakeObj = {}
const proxyThemeDescriptor = { enumerable: true, configurable: true }
const UpdateProxySymbol = Symbol('UpdateProxySymbol')

export function createThemeProxy(theme: CompiledTheme, trackState: ThemeTrackState, props?: any): any {
  let keys: any
  return new Proxy(fakeObj, {
    // fake an object but return props keys
    // because react freezes props we cant fallback to theme if we proxy props directly
    // but since useTheme() is used in limited ways, this seems to work nicely
    ownKeys() {
      keys = keys || Object.keys(props || fakeObj)
      return keys
    },
    getOwnPropertyDescriptor() {
      return proxyThemeDescriptor
    },

    set(_, key, value) {
      // allow updating props
      if (key === UpdateProxySymbol) {
        if (props != value[0]) {
          props = value[0]
          keys = Object.keys(props)
        }
        theme = value[1]
        return true
      }
      throw new Error(`Don't set on theme!`)
    },

    get(_, key) {
      if (key === UnwrapThemeSymbol) {
        return theme
      }
      if (key === OriginalPropsSymbol) {
        return props
      }
      // props override theme values here
      // TODO we need to do all the css conversions here
      // we can share styleVal probably to do stuff like color => Color
      // need to figure out how we know to do that...
      if (props) {
        if (Reflect.has(props, key)) {
          let next = Reflect.get(props, key)
          if (next !== undefined) {
            if (theme && typeof next === 'function' && Reflect.has(theme, key)) {
              // resolve functions
              next = next(theme)
            }
            return next
          }
        }
      }
      if (theme) {
        if (key[0] === '_' || !Reflect.has(theme, key)) {
          return Reflect.get(theme, key)
        }
        const val = Reflect.get(theme, key)
        if (val && val.cssVariable) {
          return new Proxy(val, {
            get(starget, skey) {
              if (Reflect.has(starget,skey)) {
                const val = Reflect.get(starget, skey)
                if (val === undefined) {
                  return val
                }
                if (skey === 'cssVariable') {
                  // unwrap
                  return starget[skey]
                }
                if (typeof key === 'string' && typeof skey === 'string') {
                  if (!starget.cssVariableSafeKeys.includes(skey)) {
                    markNonCSS(trackState, key)
                  }
                }
                return val
              }
            }
          })
        } else {
          if (val !== undefined && typeof key === 'string') {
            markNonCSS(trackState, key)
          }
          return val
        }
      }
    },
  })
}

function markNonCSS(trackState: ThemeTrackState, key: string) {
  trackState.nonCSSVariables.add(key)
  trackState.hasUsedOnlyCSSVariables = false
}
