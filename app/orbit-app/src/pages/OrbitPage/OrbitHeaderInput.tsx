import { ThemeContext, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
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

function useActivePaneName() {
  const { paneManagerStore } = useStoresSafe()
  return paneManagerStore.activePane.name
}

export default observer(function OrbitHeaderInput({ headerStore }: Props) {
  const { orbitWindowStore, queryStore } = useStoresSafe()
  const { activeTheme } = React.useContext(ThemeContext)
  const placeholder = useActivePaneName()
  return (
    <View height="100%" flex={1} position="relative" flexFlow="row" alignItems="center">
      <HighlightedTextArea
        forwardRef={headerStore.inputRef}
        width="100%"
        fontWeight={400}
        fontSize={18}
        lineHeight={22}
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
  )
})
