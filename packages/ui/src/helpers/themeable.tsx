import { CompiledTheme, Theme, ThemeSelect } from 'gloss'
import React from 'react'

export type ThemeableProps = {
  theme?: CompiledTheme
  subTheme?: ThemeSelect
  coat?: string | false
}

export function themeable<A extends any>(Component: A): A {
  return function ThemeProp(props: ThemeableProps) {
    if (!props.subTheme && !props.coat && !props.theme) {
      return <Component {...props} />
    }
    return (
      <Theme subTheme={props.subTheme} coat={props.coat}>
        <Component {...props} />
      </Theme>
    )
  } as any
}
