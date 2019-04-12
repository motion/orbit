import { ThemeSet } from '@o/css'
import { ThemeProvide } from '@o/gloss'
import React from 'react'
import { ProvideFocus } from './Focus'

export type ProvideUIProps = {
  activeTheme?: string
  themes: ThemeSet
  children?: any
}

export function ProvideUI(props: ProvideUIProps) {
  return (
    <ProvideFocus>
      <ThemeProvide activeTheme={props.activeTheme} themes={props.themes}>
        {props.children}
      </ThemeProvide>
    </ProvideFocus>
  )
}
