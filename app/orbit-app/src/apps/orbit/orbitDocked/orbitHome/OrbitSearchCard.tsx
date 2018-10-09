import * as React from 'react'
import { SearchStore } from '../SearchStore'
import { view } from '@mcro/black'
import { HighlightText } from '../../../../views/HighlightText'
import { Text } from '@mcro/ui'
import { OrbitCard } from '../../../../views/OrbitCard'
import { handleClickLocation } from '../../../../helpers/handleClickLocation'
import { Bit } from '@mcro/models'

type Props = {
  model: Bit
  index: number
  query: string
  offset: number
  searchStore: SearchStore
}

const collapseWhitespace = str => (typeof str === 'string' ? str.replace(/\n[\s]*/g, ' ') : str)
const SearchResultText = props => <Text wordBreak="break-all" fontWeight={400} {...props} />
const OrbitCardContent = view({
  padding: [6, 0],
  flex: 1,
  overflow: 'hidden',
  whiteSpace: 'pre',
})

const hideSlack = {
  title: true,
  people: true,
}

// stays static and non-reactive to prevent re-rendering during infinite scroll
export class OrbitSearchCard extends React.Component<Props> {
  getChildren = ({ content }, bit) => {
    return bit.integration === 'slack' ? (
      <SearchResultText>{content}</SearchResultText>
    ) : (
      <OrbitCardContent>
        <HighlightText whiteSpace="normal" alpha={0.65} options={{ maxSurroundChars: 100 }}>
          {collapseWhitespace(content)}
        </HighlightText>
      </OrbitCardContent>
    )
  }

  spaceBetween = <div style={{ flex: 1 }} />

  render() {
    const { model, index, query } = this.props
    const isConversation = model.integration === 'slack'
    console.log('model', model)
    return (
      <OrbitCard
        pane={name}
        subPane="search"
        index={index}
        model={model}
        hide={isConversation ? hideSlack : null}
        subtitleSpaceBetween={this.spaceBetween}
        isExpanded
        searchTerm={query}
        onClickLocation={handleClickLocation}
        maxHeight={isConversation ? 380 : 200}
        overflow="hidden"
        extraProps={{
          minimal: true,
        }}
      >
        {this.getChildren}
      </OrbitCard>
    )
  }
}
