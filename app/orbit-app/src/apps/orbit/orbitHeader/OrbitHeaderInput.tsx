import * as React from 'react'
import { HighlightedTextArea } from '../../../views/HighlightedTextArea'
import { view, compose } from '@mcro/black'
import { View, Icon, ClearButton, Tooltip } from '@mcro/ui'
import { App } from '@mcro/stores'
import { QueryStore } from '../orbitDocked/QueryStore'
import { HeaderStore } from './HeaderStore'
import { ThemeObject } from '@mcro/gloss'
import { OrbitStore } from '../../OrbitStore'
import { SearchStore } from '../orbitDocked/SearchStore'

const handleKeyDown = e => {
  // up/down/enter
  const { keyCode } = e
  if (keyCode === 38 || keyCode === 40 || keyCode === 13) {
    e.preventDefault()
  }
}

type Props = {
  theme: ThemeObject
  queryStore?: QueryStore
  headerStore: HeaderStore
  orbitStore?: OrbitStore
  searchStore?: SearchStore
}

const decorator = compose(
  view.attach('orbitStore', 'queryStore', 'searchStore'),
  view,
)

const Interactive = view({
  flexFlow: 'row',
  alignItems: 'center',
  disabled: {
    opacity: 0,
    pointerEvents: 'none',
  },
})

export const OrbitHeaderInput = decorator(
  ({ orbitStore, queryStore, theme, headerStore, searchStore }: Props) => {
    return (
      <View height="100%" flex={1} position="relative" flexFlow="row" alignItems="center">
        <HighlightedTextArea
          width="100%"
          fontWeight={400}
          fontSize={18}
          lineHeight={22}
          border="none"
          display="block"
          background="transparent"
          value={queryStore.query}
          highlight={headerStore.highlightWords}
          color={theme.color}
          onChange={queryStore.onChangeQuery}
          onFocus={orbitStore.onFocus}
          onBlur={orbitStore.onBlur}
          onKeyDown={handleKeyDown}
          forwardRef={headerStore.inputRef}
          onClick={headerStore.onClickInput}
          placeholder={headerStore.placeholder}
        />
        <Interactive disabled={!searchStore.hasQueryVal}>
          <ClearButton onClick={queryStore.clearQuery} />
        </Interactive>
      </View>
    )
  },
)
