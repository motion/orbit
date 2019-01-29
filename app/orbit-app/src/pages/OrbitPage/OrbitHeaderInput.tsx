import { gloss } from '@mcro/gloss'
import { ClearButton, ThemeContext, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useActiveSpace } from '../../hooks/useActiveSpace'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { HighlightedTextArea } from '../../views/HighlightedTextArea'
import { HeaderStore } from './OrbitHeader'

const handleKeyDown = e => {
  // up/down/enter
  const { keyCode } = e
  if (keyCode === 38 || keyCode === 40 || keyCode === 13) {
    e.preventDefault()
  }
}

type Props = {
  headerStore: HeaderStore
}

function useActivePane() {
  const { paneManagerStore } = useStoresSafe()
  return paneManagerStore.activePane
}

export default observer(function OrbitHeaderInput({ headerStore }: Props) {
  const { orbitStore, orbitWindowStore, queryStore } = useStoresSafe()
  const { activeTheme } = React.useContext(ThemeContext)
  const [activeSpace] = useActiveSpace()
  const activePane = useActivePane()
  const placeholder =
    (activePane &&
      activeSpace &&
      (activePane.type === 'sources' ? `Manage ${activeSpace.name}` : activePane.name)) ||
    ''
  const fontSize = orbitStore.isTorn ? 16 : 18
  return (
    <FakeInput maxWidth={orbitStore.isTorn ? `calc(80% - ${400}px)` : 820}>
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
        {queryStore.hasQuery && <ClearButton onClick={queryStore.clearQuery} />}
        {/* <OrbitHeaderButtons /> */}
      </After>
    </FakeInput>
  )
})

const After = gloss({
  alignItems: 'center',
  flexFlow: 'row',
})

const FakeInput = gloss(View, {
  height: 32,
  padding: [2, 8],
  alignItems: 'center',
  justifyContent: 'center',
  margin: ['auto', 8],
  flexFlow: 'row',
  width: '75%',
  minWidth: 400,
  cursor: 'text',
  transition: 'none',
  '&:active': {
    background: [0, 0, 0, 0.035],
    transition: 'all ease-out 350ms 350ms',
  },
})
