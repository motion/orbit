import { ThemeSet } from '@o/css'
import { ThemeProvide } from 'gloss'
import React, { memo, useMemo } from 'react'

import { ProvideBanner } from './Banner'
import { ProvideFocus } from './Focus'
import { ProvideSearch } from './Search'
import { ProvideShare } from './Share'
import { ProvideShortcut } from './Shortcut'
import { HighlightsContext } from './text/HighlightText'
import { Visibility } from './Visibility'

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
        <ProvideBanner>
          <ProvideSearch query="">
            <Visibility visible={true}>
              <ProvideFocus focused={true}>
                <ProvideShortcut>
                  <ProvideShare>{props.children}</ProvideShare>
                </ProvideShortcut>
              </ProvideFocus>
            </Visibility>
          </ProvideSearch>
        </ProvideBanner>
      </ThemeProvide>
    </HighlightsContext.Provider>
  )
})
