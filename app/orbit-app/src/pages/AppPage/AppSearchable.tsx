import { Button, Icon, Input, InputProps, MergeHighlightsContext, Row } from '@o/ui'
import * as React from 'react'
import { useStores } from '../../hooks/useStores'

export type SearchableProps = {
  children: React.ReactNode
  inputProps?: InputProps
}

export const AppSearchable = React.memo(function AppSearchable(props: SearchableProps) {
  const { queryStore } = useStores()

  return (
    <>
      <Row padding={6} paddingBottom={10}>
        <Input
          flex={1}
          // !TODO we have two Inputs, i removed one, need to resolve...
          // hover={false}
          // select={false}
          // focus={false}
          // active={false}
          // sizeHeight={0.95}
          placeholder="Search..."
          // {...props.inputProps}
        />
        <ContextButton marginLeft={6} />
      </Row>
      <MergeHighlightsContext
        value={{
          words: queryStore.query.split(' '),
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
