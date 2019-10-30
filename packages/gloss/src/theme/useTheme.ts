import { useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { GlossThemeProps } from '../types'
import { CompiledTheme } from './createTheme'
import { createThemeProxy, UpdateProxySymbol } from './createThemeProxy'
import { preProcessTheme } from './preProcessTheme'
import { CurrentThemeContext } from './Theme'

// can optionally pass in props accepted by theme

export type ThemeTrackState = {
  theme: CompiledTheme
  hasUsedOnlyCSSVariables: boolean
  nonCSSVariables: Set<string>
  usedProps: Set<string>
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
      usedProps: new Set(),
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

export const OriginalPropsSymbol = Symbol('OriginalPropsSymbol') as any

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
