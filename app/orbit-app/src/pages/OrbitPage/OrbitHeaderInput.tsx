import { gloss } from '@mcro/gloss'
import { getIsTorn, useActiveSpace } from '@mcro/kit'
import { ClearButton, ThemeContext, View } from '@mcro/ui'
import React, { memo } from 'react'
import { useStores } from '../../hooks/useStores'
import { HighlightedTextArea } from '../../views/HighlightedTextArea'

const handleKeyDown = e => {
  // up/down/enter
  const { keyCode } = e
  if (keyCode === 38 || keyCode === 40 || keyCode === 13) {
    e.preventDefault()
  }
}

function useActivePane() {
  const { paneManagerStore } = useStores()
  return paneManagerStore.activePane
}

export default memo(function OrbitHeaderInput() {
  const { orbitWindowStore, queryStore, headerStore } = useStores()
  const { activeTheme } = React.useContext(ThemeContext)
  const [activeSpace] = useActiveSpace()
  const activePane = useActivePane()
  const placeholder =
    (activePane &&
      activeSpace &&
      (activePane.type === 'sources' ? `Manage ${activeSpace.name}` : activePane.name)) ||
    ''
  const fontSize = getIsTorn() ? 16 : 18
  return (
    <FakeInput>
      <View height="100%" flex={1} position="relative" flexFlow="row" alignItems="center">
        <HighlightedTextArea
          forwardRef={headerStore.inputRef}
          width="100%"
          fontWeight={400}
          fontSize={fontSize}
          lineHeight={fontSize + 4}
          border="none"
          display="block"
          background="transparent"
          placeholder={placeholder}
          value={queryStore.queryInstant}
          highlight={headerStore.highlightWords}
          color={activeTheme.color}
          onChange={queryStore.onChangeQuery}
          onFocus={orbitWindowStore.onFocus}
          onBlur={orbitWindowStore.onBlur}
          onKeyDown={handleKeyDown}
        />
      </View>
      <After>
        <ClearButton
          margin={['auto', 5]}
          hidden={!queryStore.hasQuery}
          onClick={queryStore.clearQuery}
        />
      </After>
    </FakeInput>
  )
})

const After = gloss({
  position: 'absolute',
  top: 0,
  right: 0,
  bottom: 0,
  alignItems: 'center',
  justifyContent: 'center',
  flexFlow: 'row',
})

const FakeInput = gloss(View, {
  position: 'relative',
  height: 34,
  padding: [2, 10],
  alignItems: 'center',
  justifyContent: 'center',
  flexFlow: 'row',
  flex: 1,
  cursor: 'text',
  transition: 'none',
  '&:active': {
    background: [0, 0, 0, 0.035],
    transition: 'all ease-out 350ms 350ms',
  },
})
