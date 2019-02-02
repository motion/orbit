import { GmailBitData } from '@mcro/models'
import * as React from 'react'
import { ItemPropsContext } from '../../../../helpers/contexts/ItemPropsContext'
import { HighlightTextItem } from '../../../../views/HighlightTextItem'
import { OrbitItemViewProps } from '../../../types'
import { ThreadMessage } from './ThreadMessage'

export const Thread = ({ item, renderText }: OrbitItemViewProps<any>) => {
  const itemProps = React.useContext(ItemPropsContext)

  if (!item) {
    return null
  }
  const { messages } = item.data as GmailBitData
  if (!messages) {
    return null
  }
  if (renderText) {
    return renderText(item.body)
  }
  if (itemProps.oneLine) {
    return <HighlightTextItem ellipse>{item.body.slice(0, 200)}</HighlightTextItem>
  }

  return (
    <div>
      {messages.map((message, index) => {
        return <ThreadMessage key={index} message={message} />
      })}
    </div>
  )
}
