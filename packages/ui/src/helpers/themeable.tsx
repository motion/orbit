import { Theme, ThemeObject, ThemeSelect } from 'gloss'
import React from 'react'

export type ThemeableProps = {
  theme?: string | ThemeObject
  themeSubSelect?: ThemeSelect
  coat?: string
}

export function themeable<A extends any>(Component: A): A {
  return function ThemeProp({ themeSubSelect, coat, theme, ...rest }: ThemeableProps) {
    return (
      <Theme themeSubSelect={themeSubSelect} coat={coat} theme={theme}>
        <Component {...rest} />
      </Theme>
    )
  } as any
}
