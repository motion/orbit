import * as React from 'react'
import { HighlightedTextArea } from '../../views/HighlightedTextArea'
import { StoreContext } from '@mcro/black'
import { View, ThemeContext } from '@mcro/ui'
import { HeaderStore } from './OrbitHeader'
import { observer } from 'mobx-react-lite'
import { capitalize } from 'lodash'
import { useObserveActiveApps } from '../../hooks/useObserveActiveApps'

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
  const { paneManagerStore } = React.useContext(StoreContext)
  const apps = useObserveActiveApps()
  if (!apps.length) {
    return 'Orbit'
  }
  let pane = paneManagerStore.activePane
  if (typeof pane === 'number') {
    const activeApp = apps.find(x => x.id === pane)
    if (activeApp) {
      pane = activeApp.name
    }
  }
  return pane === 'Search' ? 'Orbit' : capitalize(pane)
}

export const OrbitHeaderInput = observer(({ headerStore }: Props) => {
  const { orbitWindowStore, queryStore } = React.useContext(StoreContext)
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
