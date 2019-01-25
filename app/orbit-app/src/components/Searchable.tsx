import { Button, Input, Row } from '@mcro/ui'
import * as React from 'react'
import { MergeHighlightsContext } from '../helpers/contexts/HighlightsContext'
import { QueryStore } from '../stores/QueryStore/QueryStore'
import { Icon } from '../views/Icon'

export type SearchableProps = {
  queryStore: QueryStore
  children: React.ReactNode
  inputProps?: Object
}

export default React.memo(function Searchable(props: SearchableProps) {
  return (
    <>
      <Row padding={6} paddingBottom={10}>
        <Input
          flex={1}
          hover={false}
          select={false}
          focus={false}
          active={false}
          sizeHeight={0.95}
          placeholder="Search..."
          {...props.inputProps}
        />
        <ContextButton marginLeft={6} />
      </Row>
      <MergeHighlightsContext
        value={{
          words: props.queryStore.query.split(' '),
          maxChars: 500,
          maxSurroundChars: 80,
        }}
      >
        {props.children}
      </MergeHighlightsContext>
    </>
  )
})

const ContextButton = props => {
  return (
    <Button
      sizePadding={0.4}
      tooltip="Test context tooltip"
      tooltipProps={{ towards: 'right' }}
      {...props}
    >
      <Icon name="orbitalSmall" size={24} />
    </Button>
  )
}
