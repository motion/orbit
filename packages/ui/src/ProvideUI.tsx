import { ThemeSet } from '@o/css'
import { ThemeProvide } from '@o/gloss'
import React, { memo } from 'react'
import { ProvideFocus } from './Focus'
import { ProvideShare } from './Share'
import { ProvideShortcut } from './Shortcut'
import { ProvideVisibility } from './Visibility'

export type ProvideUIProps = {
  activeTheme?: string
  themes: ThemeSet
  children?: any
}

export const ProvideUI = memo((props: ProvideUIProps) => {
  return (
    <ProvideVisibility visible={true}>
      <ProvideShortcut>
        <ProvideFocus>
          <ProvideShare>
            <ThemeProvide activeTheme={props.activeTheme} themes={props.themes}>
              {props.children}
            </ThemeProvide>
          </ProvideShare>
        </ProvideFocus>
      </ProvideShortcut>
    </ProvideVisibility>
  )
})
