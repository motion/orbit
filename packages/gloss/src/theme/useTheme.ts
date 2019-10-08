import { useContext, useEffect, useMemo, useRef, useState } from 'react'

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

  useEffect(() => {
    const sub = themeObservable.subscribe(theme => {
      if (!state.current!.hasUsedOnlyCSSVariables) {
        console.warn('re-rendering because used variables', state.current)
        setCur(getTheme(theme, props))
      }
    })
    return sub.unsubscribe
  }, [])

  return proxyTheme(cur, state.current, props)
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

function proxyTheme(theme: CompiledTheme, trackState: ThemeTrackState, props?: any): any {
  return useMemo(() => {
    return new Proxy(props || theme, {
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
            return Reflect.get(props, key)
          }
        }
        if (key[0] === '_' || !Reflect.has(theme, key)) {
          return Reflect.get(theme, key)
        }
        const val = Reflect.get(theme, key)
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
