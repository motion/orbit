import { gloss } from '@mcro/gloss'
import { SlackBitDataMessage } from '@mcro/models'
import { Row, Text, View } from '@mcro/ui'
import * as React from 'react'
import { ItemPropsContext } from '../../../../helpers/contexts/ItemPropsContext'
import { DateFormat } from '../../../../views/DateFormat'
import { HighlightText } from '../../../../views/HighlightText'
import { Markdown } from '../../../../views/Markdown'
import { RoundButtonPerson } from '../../../../views/RoundButtonPerson'
import { OrbitItemViewProps } from '../../../types'

type SlackMessageProps = OrbitItemViewProps<'slack'> & {
  message: SlackBitDataMessage
  previousMessage?: SlackBitDataMessage
  highlight?: Object
}

const SlackMessageFrame = gloss(View, {
  padding: [0, 0],
  overflow: 'hidden',
  condensed: {
    flexFlow: 'row',
    alignItems: 'center',
  },
})

const SlackMessageInner = gloss({
  padding: [0, 16],
  flex: 1,
  overflow: 'hidden',
})

export function ChatMessage(rawProps: SlackMessageProps) {
  const itemProps = React.useContext(ItemPropsContext)
  const { item, message, renderText, previousMessage } = { ...itemProps, ...rawProps }

  if (!message.text || !item) {
    return null
  }
  const person = (item.people || []).find(person => person.integrationId === message.user)
  let previousBySameAuthor = false
  let previousWithinOneMinute = false
  if (previousMessage) {
    previousBySameAuthor = message.user === previousMessage.user
    previousWithinOneMinute = message.time - previousMessage.time < 1000 * 60 // todo(nate) can you please check it?
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
        <Markdown className="slack-markdown" source={message.text} />
      </Text>
    )
  }

  return (
    <SlackMessageFrame condensed={itemProps.condensed} {...itemProps.itemProps}>
      {!hideHeader && (
        <Row
          alignItems="center"
          userSelect="none"
          cursor="default"
          padding={[itemProps.condensed ? 0 : 3, 0]}
        >
          {itemProps.beforeTitle || null}
          {!!person && (
            <RoundButtonPerson
              hideAvatar={itemProps.condensed}
              background="transparent"
              person={person}
            />
          )}
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
      <SlackMessageInner>{content}</SlackMessageInner>
    </SlackMessageFrame>
  )
}
