import * as React from 'react'
import { ThemeContext } from './ThemeContext'

// HoC for active theme attaching

export const wrapTheme = (props, Klass, avoidTheme?) => {
  if (props.theme || avoidTheme) {
    return <Klass {...props} />
  }
  return (
    <ThemeContext.Consumer>
      {({ allThemes, activeThemeName }) => {
        return <Klass {...props} theme={allThemes[activeThemeName]} />
      }}
    </ThemeContext.Consumer>
  )
}

export function attachTheme<T>(Klass: T): T {
  Klass['_hasTheme'] = true
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
