import { Button, HighlightProvide, Icon, Input, InputProps, Row } from '@o/ui'
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
        <Input flex={1} placeholder="Search..." {...props.inputProps} />
        <ContextButton marginLeft={6} />
      </Row>
      <HighlightProvide
        value={{
          words: queryStore.query.split(' '),
          maxChars: 500,
          maxSurroundChars: 80,
        }}
      >
        {props.children}
      </HighlightProvide>
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
