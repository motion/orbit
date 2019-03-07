import { gloss, Row, View } from '@mcro/gloss'
import React, { useContext } from 'react'
import { ButtonPerson } from '../buttons/ButtonPerson'
import { DateFormat } from '../text/DateFormat'
import { HighlightText } from '../text/HighlightText'
import { Text } from '../text/Text'
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
    previousWithinOneMinute = message.time - previousMessage.time < 1000 * 60
  }
  const hideHeader = previousBySameAuthor && previousWithinOneMinute

  let content: any

  if (renderText) {
    content = renderText(message.text)
  } else if (itemProps.condensed) {
    content = (
      <HighlightText ellipse {...itemProps.textProps}>
        {message.text}
      </HighlightText>
    )
  } else {
    content = (
      <Text
        selectable={!itemProps.preventSelect}
        ellipse={itemProps.condensed ? true : null}
        {...itemProps.textProps}
      >
        <Markdown className="chat-markdown" source={message.text} />
      </Text>
    )
  }

  return (
    <ChatMessageFrame condensed={itemProps.condensed} {...itemProps.itemProps}>
      {!hideHeader && (
        <Row
          alignItems="center"
          userSelect="none"
          cursor="default"
          padding={[itemProps.condensed ? 0 : 3, 0]}
        >
          {itemProps.beforeTitle || null}
          {!!person && <ButtonPerson background="transparent" photo={person.photo} />}
          {!itemProps.condensed && (
            <>
              <div style={{ width: 6 }} />
              {(!previousMessage || !previousWithinOneMinute) && (
                <Text size={0.9} fontWeight={500} alpha={0.5}>
                  {<DateFormat date={new Date(message.time)} />}
                </Text>
              )}
            </>
          )}
        </Row>
      )}
      <ChatMessageInner>{content}</ChatMessageInner>
    </ChatMessageFrame>
  )
}

const ChatMessageFrame = gloss(View, {
  padding: [0, 0],
  overflow: 'hidden',
  condensed: {
    flexFlow: 'row',
    alignItems: 'center',
  },
})

const ChatMessageInner = gloss({
  padding: [0, 16],
  flex: 1,
  overflow: 'hidden',
})
