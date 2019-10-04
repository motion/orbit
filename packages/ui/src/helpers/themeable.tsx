import { CompiledTheme, Theme, ThemeSelect } from 'gloss'
import React from 'react'

export type ThemeableProps = {
  theme?: CompiledTheme
  themeSubSelect?: ThemeSelect
  coat?: string | false
}

export function themeable<A extends any>(Component: A): A {
  return function ThemeProp(props: ThemeableProps) {
    if (!props.themeSubSelect && !props.coat && !props.theme) {
      return <Component {...props} />
    }
    return (
      <Theme themeSubSelect={props.themeSubSelect} coat={props.coat} theme={props.theme}>
        <Component {...props} />
      </Theme>
    )
  } as any
}
