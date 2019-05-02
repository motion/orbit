import { Theme, ThemeSelect } from '@o/gloss'
import { SimpleStyleObject } from '@o/gloss/_/theme/ThemeMaker'
import React from 'react'

export type ThemeableProps = {
  theme?: string | SimpleStyleObject
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
