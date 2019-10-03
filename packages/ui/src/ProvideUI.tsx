import { CompiledTheme, ThemeProvide } from 'gloss'
import React from 'react'

import { ProvideDraggable } from './Draggable'
import { ProvideFocus, ProvideFocusManager } from './Focus'
import { ProvideHighlight } from './Highlight'
import { ProvideSearch } from './Search'
import { ProvideShare } from './Share'
import { ProvideShortcut } from './Shortcut'
import { ProvideVisibility } from './Visibility'

export type ProvideUIProps = {
  activeTheme: string
  themes: { [key: string]: CompiledTheme }
  children?: any
}

export const ProvideUI = (props: ProvideUIProps) => {
  return (
    <ProvideHighlight>
      <ThemeProvide activeTheme={props.activeTheme} themes={props.themes}>
        <ProvideDraggable>
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
        </ProvideDraggable>
      </ThemeProvide>
    </ProvideHighlight>
  )
}
