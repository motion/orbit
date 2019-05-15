import { ThemeSet } from '@o/css'
import { ThemeProvide } from 'gloss'
import React, { memo, useMemo } from 'react'

import { ProvideFocus } from './Focus'
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
      <ProvideVisibility visible={true}>
        <ProvideFocus focused={true}>
          <ProvideShortcut>
            <ProvideShare>
              <ThemeProvide activeTheme={props.activeTheme} themes={props.themes}>
                {props.children}
              </ThemeProvide>
            </ProvideShare>
          </ProvideShortcut>
        </ProvideFocus>
      </ProvideVisibility>
    </HighlightsContext.Provider>
  )
})
