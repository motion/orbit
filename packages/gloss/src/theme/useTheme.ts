import { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { CompiledTheme } from './createTheme'
import { preProcessTheme } from './preProcessTheme'
import { CurrentThemeContext } from './Theme'

// can optionally pass in props accepted by theme

type ThemeTrackState = {
  hasUsedOnlyCSSVariables: boolean
  nonCSSVariables: Set<string>
}

type UseThemeProps = {
  coat?: string | false
  // accepts all normal props and converts them to ThemeValue/Color etc
  [key: string]: any
}

export function useTheme(props?: UseThemeProps) {
  const themeObservable = useContext(CurrentThemeContext)
  const [cur, setCur] = useState<CompiledTheme>(getTheme(themeObservable.current, props))
  const state = useRef<ThemeTrackState>()
  if (!state.current) {
    state.current = {
      hasUsedOnlyCSSVariables: true,
      nonCSSVariables: new Set(),
    }
  }

  useEffect(() => {
    const sub = themeObservable.subscribe(theme => {
      if (!state.current!.hasUsedOnlyCSSVariables) {
        console.warn('re-rendering because used variables', state.current)
        setCur(getTheme(theme, props))
      }
    })
    return sub.unsubscribe
  }, [])

  return proxyTheme(cur, state.current)
}

const getTheme = (theme?: CompiledTheme, props?: UseThemeProps) => {
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

function proxyTheme(theme: CompiledTheme, trackState: ThemeTrackState) {
  return useMemo(() => {
    return new Proxy(theme, {
      get(target, key) {
        if (key === UnwrapThemeSymbol) {
          return theme
        }
        if (key[0] === '_' || !Reflect.has(target, key)) {
          return Reflect.get(target, key)
        }
        const val = Reflect.get(target, key)
        if (val && val.cssVariable) {
          return new Proxy(val, {
            get(starget, skey) {
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
              return Reflect.get(starget, skey)
            }
          })
        } else {
          if (typeof key === 'string') {
            trackState.nonCSSVariables.add(key)
            trackState.hasUsedOnlyCSSVariables = false
          }
          return val
        }
      },
    })
  }, [])
}
