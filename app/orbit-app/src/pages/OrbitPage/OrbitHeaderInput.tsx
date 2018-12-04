import * as React from 'react'
import { HighlightedTextArea } from '../../views/HighlightedTextArea'
import { view, attach } from '@mcro/black'
import { View } from '@mcro/ui'
import { QueryStore } from '../../stores/QueryStore/QueryStore'
import { ThemeObject } from '@mcro/gloss'
import { OrbitWindowStore } from '../../stores/OrbitWindowStore'
import { PaneManagerStore } from '../../stores/PaneManagerStore'
import { HeaderStore } from './OrbitHeader'

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
  orbitWindowStore?: OrbitWindowStore
  paneManagerStore?: PaneManagerStore
}

@attach('paneManagerStore', 'orbitWindowStore', 'queryStore')
@view
export class OrbitHeaderInput extends React.Component<Props> {
  render() {
    const { orbitWindowStore, queryStore, theme, headerStore } = this.props
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
          value={queryStore.queryInstant}
          highlight={headerStore.highlightWords}
          color={theme.color}
          onChange={queryStore.onChangeQuery}
          onFocus={orbitWindowStore.onFocus}
          onBlur={orbitWindowStore.onBlur}
          onKeyDown={handleKeyDown}
          forwardRef={headerStore.inputRef}
          onClick={headerStore.onClickInput}
        />
      </View>
    )
  }
}
