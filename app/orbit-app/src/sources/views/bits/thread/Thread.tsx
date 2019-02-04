import { GmailBitData } from '@mcro/models'
import * as React from 'react'
import { ItemPropsContext } from '../../../../helpers/contexts/ItemPropsContext'
import { HighlightTextItem } from '../../../../views/HighlightTextItem'
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
    return <HighlightTextItem ellipse>{props.item.body.slice(0, 200)}</HighlightTextItem>
  }

  return (
    <div>
      {messages.map((message, index) => {
        return <ThreadMessage key={index} message={message} />
      })}
    </div>
  )
}
