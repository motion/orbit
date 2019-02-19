import { GmailBitData } from '@mcro/models'
import { HighlightText } from '@mcro/ui'
import * as React from 'react'
import { ItemPropsContext } from '../../../../helpers/contexts/ItemPropsContext'
import { OrbitItemViewProps } from '../../../types'
import { ThreadMessage } from './ThreadMessage'

export const Thread = (rawProps: OrbitItemViewProps<any>) => {
  const itemProps = React.useContext(ItemPropsContext)
  const props = { ...itemProps, ...rawProps }

  if (!props.item) {
    return null
  }

  const { messages } = props.item.data as GmailBitData
  if (!messages) {
    return null
  }
  if (props.renderText) {
    return props.renderText(props.item.body)
  }
  if (props.oneLine) {
    return <HighlightText ellipse>{props.item.body.slice(0, 200)}</HighlightText>
  }

  return (
    <div>
      {messages.map((message, index) => {
        return <ThreadMessage key={index} message={message} />
      })}
    </div>
  )
}
