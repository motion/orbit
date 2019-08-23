import { QueryStore } from '@o/kit'
import { Button, Icon, Input, ProvideHighlight, Row } from '@o/ui'
import * as React from 'react'

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
      <ProvideHighlight
        value={{
          words: props.queryStore.query.split(' '),
          maxChars: 500,
          maxSurroundChars: 80,
        }}
      >
        {props.children}
      </ProvideHighlight>
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
      <Icon name="ok" size={24} />
    </Button>
  )
}
