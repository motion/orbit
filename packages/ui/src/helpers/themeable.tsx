import { Theme, ThemeObject, ThemeSelect } from 'gloss'
import React from 'react'

export type ThemeableProps = {
  theme?: string | ThemeObject
  subTheme?: ThemeSelect
  alt?: string
}

export function themeable<A extends any>(Component: A): A {
  return function ThemeProp({ subTheme, alt, theme, ...rest }: ThemeableProps) {
    return (
      <Theme subTheme={subTheme} alt={alt} theme={theme}>
        <Component {...rest} />
      </Theme>
    )
  } as any
}
