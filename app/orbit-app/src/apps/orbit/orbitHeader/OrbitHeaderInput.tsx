import * as React from 'react'
import { HighlightedTextArea } from '../../../views/HighlightedTextArea'
import { view, compose } from '@mcro/black'
import { View } from '@mcro/ui'
import * as UI from '@mcro/ui'
import { App } from '@mcro/stores'
import { QueryStore } from '../../../stores/QueryStore'
import { HeaderStore } from './HeaderStore'
import { ThemeObject } from '@mcro/gloss'

const handleKeyDown = e => {
  // up/down/enter
  const { keyCode } = e
  if (keyCode === 38 || keyCode === 40 || keyCode === 13) {
    e.preventDefault()
  }
}

const onFocus = () => {
  App.setOrbitState({
    inputFocused: true,
  })
}

const onBlur = () => {
  App.setOrbitState({
    inputFocused: false,
  })
}

type Props = {
  theme: ThemeObject
  queryStore?: QueryStore
  headerStore: HeaderStore
}

const decorator = compose(
  view.attach('queryStore'),
  view,
)

export const OrbitHeaderInput = decorator(
  ({ queryStore, theme, headerStore }: Props) => {
    return (
      <View
        height="100%"
        flex={1}
        position="relative"
        flexFlow="row"
        alignItems="center"
      >
        <HighlightedTextArea
          width="100%"
          fontWeight={400}
          fontSize={16}
          lineHeight={22}
          border="none"
          display="block"
          background="transparent"
          value={queryStore.query}
          highlight={headerStore.highlightWords}
          color={theme.color}
          onChange={queryStore.onChangeQuery}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={handleKeyDown}
          forwardRef={headerStore.inputRef}
          onClick={headerStore.onClickInput}
          placeholder={headerStore.placeholder}
        />
        <UI.ClearButton
          onClick={queryStore.clearQuery}
          opacity={App.state.query ? 1 : 0}
        />
      </View>
    )
  },
)
