import { Bit, ButtonPerson, DateFormat, HighlightText, Surface, Text, View } from '@o/ui'
import { gloss } from 'gloss'
import React, { useContext } from 'react'

import { ItemPropsContext, ItemsPropsContextType } from './ItemPropsContext'
import { Markdown } from './Markdown'

export type ChatMessage = {
  user?: string
  text?: string
  time?: number
}

type ChatMessageProps = Partial<ItemsPropsContextType> & {
  message: ChatMessage
  people?: Bit[]
  previousMessage?: ChatMessage
}

export function ChatMessage(rawProps: ChatMessageProps) {
  const itemProps = useContext(ItemPropsContext)
  const { renderText } = { ...itemProps, ...rawProps }
  const { message, previousMessage, people } = rawProps
  const person = message.user ? (people || []).find(x => x.originalId === message.user) : null

  if (!message.text) {
    return null
  }

  let previousBySameAuthor = false
  let previousWithinOneMinute = false
  if (previousMessage && message.user && previousMessage.user) {
    previousBySameAuthor = message.user === previousMessage.user
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
        <View
          flexDirection="row"
          alignItems="center"
          cursor="default"
          padding={[itemProps.oneLine ? 0 : 3, 0]}
        >
          {itemProps.beforeTitle || null}
          {!!person && <ButtonPerson coat="flat" photo={person.photo} name={person.title} />}
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
        </View>
      )}
      <Surface
        background={theme => theme.backgroundStronger.setAlpha(0.33)}
        padding={[6, 10]}
        showInnerElement="never"
        sizeRadius={1}
      >
        {content}
      </Surface>
    </ChatMessageFrame>
  )
}

const ChatMessageFrame = gloss(View, {
  overflow: 'hidden',
  alignItems: 'flex-start',
  oneLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
})
