import * as React from 'react'
import { HighlightedTextArea } from '../../views/HighlightedTextArea'
import { StoreContext } from '@mcro/black'
import { View, ThemeContext } from '@mcro/ui'
import { HeaderStore } from './OrbitHeader'
import { observer } from 'mobx-react-lite'
import { capitalize } from 'lodash'

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

export const OrbitHeaderInput = observer(({ headerStore }: Props) => {
  const { orbitWindowStore, queryStore, paneManagerStore } = React.useContext(StoreContext)
  const { activeTheme } = React.useContext(ThemeContext)
  const pane = paneManagerStore.activePane
  const placeholder = pane === 'search' ? 'Search' : capitalize(pane)
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
