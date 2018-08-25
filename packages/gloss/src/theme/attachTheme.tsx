import * as React from 'react'
import { ThemeContext } from './ThemeContext'

// HoC for active theme attaching

export const wrapTheme = (props, Klass, avoidTheme?) => {
  if (avoidTheme) {
    return <Klass {...props} />
  }
  return (
    <ThemeContext.Consumer>
      {({ allThemes, activeThemeName }) => {
        let theme = allThemes[activeThemeName]
        // allow simple overriding of the theme using props:
        // <Button theme={{ backgroundHover: 'transparent' }} />
        // if (typeof props.theme === 'object') {
        //   console.log('merging theme', theme, props.theme)
        //   theme = {
        //     ...theme,
        //     ...props.theme,
        //   }
        // }
        return <Klass {...props} theme={theme} />
      }}
    </ThemeContext.Consumer>
  )
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
