import { ThemeSet } from '@o/css'
import { ThemeProvide } from 'gloss'
import React from 'react'

import { ProvideBanner } from './Banner'
import { ProvideDraggable } from './Draggable'
import { ProvideFocus, ProvideFocusManager } from './Focus'
import { ProvideHighlight } from './Highlight'
import { ProvideSearch } from './Search'
import { ProvideShare } from './Share'
import { ProvideShortcut } from './Shortcut'
import { ProvideVisibility } from './Visibility'

export type ProvideUIProps = {
  activeTheme?: string
  themes: ThemeSet
  children?: any
}

export const ProvideUI = (props: ProvideUIProps) => {
  return (
    <ProvideHighlight>
      <ThemeProvide activeTheme={props.activeTheme} themes={props.themes}>
        <ProvideDraggable>
          <ProvideBanner>
            <ProvideSearch query="">
              <ProvideVisibility visible={true}>
                <ProvideFocus focused={true}>
                  <ProvideShortcut>
                    <ProvideFocusManager>
                      <ProvideShare>{props.children}</ProvideShare>
                    </ProvideFocusManager>
                  </ProvideShortcut>
                </ProvideFocus>
              </ProvideVisibility>
            </ProvideSearch>
          </ProvideBanner>
        </ProvideDraggable>
      </ThemeProvide>
    </ProvideHighlight>
  )
}
