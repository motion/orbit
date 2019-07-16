import { gloss, Row } from 'gloss'
import React, { useContext } from 'react'

import { ButtonPerson } from '../buttons/ButtonPerson'
import { HighlightText } from '../Highlight'
import { SizedSurface } from '../SizedSurface'
import { DateFormat } from '../text/DateFormat'
import { Text } from '../text/Text'
import { View } from '../View/View'
import { ItemPropsContext, ItemsPropsContextType } from './ItemPropsContext'
import { Markdown } from './Markdown'

export type ChatMessage = {
  person?: {
    id?: any
    photo?: string
  }
  text?: string
  time?: number
}

type ChatMessageProps = Partial<ItemsPropsContextType> & {
  message: ChatMessage
  previousMessage?: ChatMessage
}

export function ChatMessage(rawProps: ChatMessageProps) {
  const itemProps = useContext(ItemPropsContext)
  const { renderText } = { ...itemProps, ...rawProps }
  const { message, previousMessage } = rawProps
  const { person } = message

  if (!message.text) {
    return null
  }

  let previousBySameAuthor = false
  let previousWithinOneMinute = false
  if (previousMessage && person && previousMessage.person) {
    previousBySameAuthor = person.id === previousMessage.person.id
    previousWithinOneMinute = (message.time || 0) - (previousMessage.time || 0) < 1000 * 60
  }
  const hideHeader = previousBySameAuthor && previousWithinOneMinute

  let content: any

  if (renderText) {
    content = renderText(message.text)
  } else if (itemProps.oneLine) {
    content = (
      <HighlightText ellipse {...itemProps.textProps}>
        {message.text}
      </HighlightText>
    )
  } else {
    content = (
      <Text selectable={!itemProps.preventSelect} {...itemProps.textProps}>
        <Markdown className="chat-markdown" source={message.text} />
      </Text>
    )
  }

  return (
    <ChatMessageFrame {...itemProps.itemProps}>
      {!hideHeader && (
        <Row alignItems="center" cursor="default" padding={[itemProps.oneLine ? 0 : 3, 0]}>
          {itemProps.beforeTitle || null}
          {!!person && <ButtonPerson background="transparent" photo={person.photo} />}
          {!itemProps.oneLine && (
            <>
              <div style={{ width: 6 }} />
              {(!previousMessage || !previousWithinOneMinute) && (
                <Text selectable size={0.9} fontWeight={500} alpha={0.5}>
                  {<DateFormat date={new Date(message.time || 0)} />}
                </Text>
              )}
            </>
          )}
        </Row>
      )}
      <SizedSurface
        background={theme => theme.backgroundStronger}
        padding={[6, 10]}
        noInnerElement
        sizeRadius={1}
      >
        {content}
      </SizedSurface>
    </ChatMessageFrame>
  )
}

const ChatMessageFrame = gloss(View, {
  overflow: 'hidden',
  alignItems: 'flex-start',
  oneLine: {
    flexFlow: 'row',
    alignItems: 'center',
  },
})
