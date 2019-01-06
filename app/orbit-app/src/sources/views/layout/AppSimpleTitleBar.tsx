import * as React from 'react'
import { Text } from '@mcro/ui'
import { StoreContext } from '@mcro/black'
import { gloss } from '@mcro/gloss'

type Props = {
  title: string
}

const TitleBar = gloss({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  padding: [3, 0],
  margin: [0, 30],
  alignItems: 'center',
})

export const AppSimpleTitleBar = ({ title }: Props) => {
  const { appPageStore } = React.useContext(StoreContext)
  return (
    <TitleBar draggable onDragStart={appPageStore.onDragStart}>
      <Text
        ellipse
        maxWidth="100%"
        selectable={false}
        size={0.85}
        fontWeight={600}
        alignItems="center"
      >
        {title}
      </Text>
    </TitleBar>
  )
}
