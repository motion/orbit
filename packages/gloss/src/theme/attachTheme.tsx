import * as React from 'react'
import { useTheme } from '../helpers/useTheme'

// HoC for active theme attaching

export const wrapTheme = (props, Klass, avoidTheme?) => {
  const theme = useTheme()
  if (avoidTheme) {
    return <Klass {...props} />
  }
  return <Klass {...props} theme={theme} />
}

export function attachTheme<T>(Klass: T): T {
  const AttachedKlass = props => {
    return wrapTheme(props, Klass)
  }
  // @ts-ignore
  return new Proxy(AttachedKlass, {
    set(_, method, value) {
      Klass[method] = value
      AttachedKlass[method] = value
      return true
    },
  })
}
