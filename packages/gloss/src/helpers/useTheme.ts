import { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { CompiledTheme } from '../theme/createTheme'
import { CurrentThemeContext } from '../theme/Theme'

// can optionally pass in props accepted by theme

type ThemeTrackState = {
  hasUsedOnlyCSSVariables: boolean
  nonCSSVariables: Set<string>
}

export function useTheme(props?: { ignoreCoat?: boolean }) {
  const themeObservable = useContext(CurrentThemeContext)
  const [cur, setCur] = useState<CompiledTheme>(themeObservable.current)
  const trackState = useRef<ThemeTrackState>({
    hasUsedOnlyCSSVariables: true,
    nonCSSVariables: new Set(),
  })

  useEffect(() => {
    const sub = themeObservable.subscribe(theme => {
      if (trackState.current.hasUsedOnlyCSSVariables) {
        // no need to change
      } else {
        console.warn('re-rendering because used variables', trackState.current)
        setCur(theme)
      }
    })
    return sub.unsubscribe
  }, [])

  let theme = cur

  // TODO this should not go here, maybe just wrap those themes in <Theme coat={false}> or something
  if (theme && props && props.ignoreCoat) {
    theme = theme.parent || theme
  }

  return proxyTheme(theme, trackState.current)
}

export const UnwrapTheme = Symbol('UnwrapTheme') as any

function proxyTheme(theme: CompiledTheme, trackState: ThemeTrackState) {
  return useMemo(() => {
    return new Proxy(theme, {
      get(target, key) {
        if (key === UnwrapTheme) {
          return theme
        }
        if (!Reflect.has(target, key)) {
          return
        }
        if (key[0] === '_') {
          return Reflect.get(target, key)
        }
        const val = Reflect.get(target, key)
        if (val && val.cssVariable) {
          return val
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

// simpler hooks for simpler use cases
// todo they'd need to update..

// export function useThemeContext() {
//   return useContext(CurrentThemeContext).current
// }

// export function useThemeName() {
//   return useThemeContext().name
// }
