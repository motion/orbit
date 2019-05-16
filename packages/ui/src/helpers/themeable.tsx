import { Theme, ThemeObject, ThemeSelect } from 'gloss'
import React from 'react'

export type ThemeableProps = {
  theme?: string | ThemeObject
  themeSelect?: ThemeSelect
  alt?: string
}

export function themeable<A extends any>(Component: A): A {
  return function ThemeProp({ themeSelect, alt, theme, ...rest }: ThemeableProps) {
    return (
      <Theme themeSelect={themeSelect} alt={alt} theme={theme}>
        <Component {...rest} />
      </Theme>
    )
  } as any
}
