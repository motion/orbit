import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { GlossThemeProps } from '../types'
import { CompiledTheme } from './createTheme'
import { preProcessTheme } from './preProcessTheme'
import { CurrentThemeContext } from './Theme'

// can optionally pass in props accepted by theme

type ThemeTrackState = {
  hasUsedOnlyCSSVariables: boolean
  nonCSSVariables: Set<string>
}

export function useTheme<A = {}>(props?: A): GlossThemeProps<A> {
  const themeObservable = useContext(CurrentThemeContext)
  const [cur, setCur] = useState<CompiledTheme>(getTheme(themeObservable.current, props))
  const state = useRef<ThemeTrackState>()
  if (!state.current) {
    state.current = {
      hasUsedOnlyCSSVariables: true,
      nonCSSVariables: new Set(),
    }
  }

  const proxy = useMemo(() => createThemePropsProxy(cur, state.current!, props), [])
  proxy[UpdateProxySymbol] = [props, cur]

  useEffect(() => {
    const sub = themeObservable.subscribe(theme => {
      if (!state.current!.hasUsedOnlyCSSVariables) {
        console.warn('re-rendering because used variables', state.current?.nonCSSVariables, props)
        setCur(getTheme(theme, props))
      }
    })
    return sub.unsubscribe
  }, [])

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
export const getOriginalProps = (themeProps: any): any => {
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

function createThemePropsProxy(theme: CompiledTheme, trackState: ThemeTrackState, props?: any): any {
  let keys
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
                    trackState.nonCSSVariables.add(key)
                    trackState.hasUsedOnlyCSSVariables = false
                  }
                }
                return val
              }
            }
          })
        } else {
          if (val !== undefined && typeof key === 'string') {
            trackState.nonCSSVariables.add(key)
            trackState.hasUsedOnlyCSSVariables = false
          }
          return val
        }
      }
    },
  })
}
