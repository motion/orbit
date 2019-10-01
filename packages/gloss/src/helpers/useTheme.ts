import { ThemeObject } from '@o/css/src/css'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { ThemeContext, ThemeContextType } from '../theme/ThemeContext'
import { ThemeObservable } from '../theme/ThemeObservable'

// can optionally pass in props accepted by theme

export const useThemeContext = () => useContext(ThemeContext)

type ThemeTrackState = {
  hasUsedOnlyCSSVariables: boolean
}

export function useTheme(props?: { ignoreCoat?: boolean }) {
  const themeObservable = useContext(ThemeObservable)
  const [cur, setCur] = useState<ThemeContextType>(themeObservable.current)
  const trackState = useRef<ThemeTrackState>({
    hasUsedOnlyCSSVariables: false,
  })

  console.log('themeObservable.current', themeObservable)

  useEffect(() => {
    themeObservable.subscribe(theme => {
      if (trackState.current.hasUsedOnlyCSSVariables) {
        // no need to change
      } else {
        setCur(theme)
      }
    })
  })

  let theme = cur.activeTheme
  // TODO this should not go here, maybe just wrap those themes in <Theme coat={false}> or something
  if (props && props.ignoreCoat) {
    theme = theme._originalTheme || theme
  }

  return proxyTheme(theme, trackState.current)
}

function proxyTheme(theme: ThemeObject, trackState: ThemeTrackState) {
  return useMemo(() => {
    return new Proxy(theme, {
      get(target, key) {
        const val = Reflect.get(target, key)
        if (val && val.toCSSVariable) {
          return val
        } else {
          trackState.hasUsedOnlyCSSVariables = false
          return val
        }
      },
    })
  }, [])
}
