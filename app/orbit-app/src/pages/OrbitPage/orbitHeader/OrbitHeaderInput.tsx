import * as React from 'react'
import { HighlightedTextArea } from '../../../views/HighlightedTextArea'
import { view, attach } from '@mcro/black'
import { View } from '@mcro/ui'
import { QueryStore } from '../orbitDocked/QueryStore'
import { HeaderStore } from './HeaderStore'
import { ThemeObject } from '@mcro/gloss'
import { OrbitStore } from '../OrbitStore'
import { SearchStore } from '../orbitDocked/SearchStore'
import { PaneManagerStore } from '../PaneManagerStore'

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
  paneManagerStore?: PaneManagerStore
}

@attach('paneManagerStore', 'orbitStore', 'queryStore', 'searchStore')
@view
export class OrbitHeaderInput extends React.Component<Props> {
  render() {
    const { orbitStore, queryStore, theme, headerStore } = this.props
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
        />
      </View>
    )
  }
}
