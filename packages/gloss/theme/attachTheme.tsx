import * as React from 'react'
import { ThemeContext } from './ThemeContext'

// HoC for active theme attaching

export const attachTheme = Klass => {
  Klass._hasTheme = true
  const AttachedKlass = props => (
    <ThemeContext.Consumer>
      {({ allThemes, activeThemeName }) => {
        return <Klass {...props} theme={allThemes[activeThemeName]} />
      }}
    </ThemeContext.Consumer>
  )
  return new Proxy(AttachedKlass, {
    set(_, method, value) {
      Klass[method] = value
      return true
    },
  })
}
