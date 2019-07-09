import { ThemeSet } from '@o/css'
import { ThemeProvide } from 'gloss'
import React, { memo, useMemo } from 'react'

import { ProvideBanner } from './Banner'
import { ProvideDraggable } from './Draggable'
import { ProvideFocus, ProvideFocusManager } from './Focus'
import { ProvideSearch } from './Search'
import { ProvideShare } from './Share'
import { ProvideShortcut } from './Shortcut'
import { HighlightsContext } from './text/HighlightText'
import { ProvideVisibility } from './Visibility'

export type ProvideUIProps = {
  activeTheme?: string
  themes: ThemeSet
  children?: any
}

export const ProvideUI = memo((props: ProvideUIProps) => {
  const defaultHighlight = useMemo(
    () => ({
      words: [],
      maxSurroundChars: Infinity,
      maxChars: Infinity,
    }),
    [],
  )
  return (
    <HighlightsContext.Provider value={defaultHighlight}>
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
    </HighlightsContext.Provider>
  )
})
