import { gloss } from '@mcro/gloss'
import { SlackBitDataMessage } from '@mcro/models'
import { Row, Text, View } from '@mcro/ui'
import * as React from 'react'
import { ItemResolverDecorationContext } from '../../../../helpers/contexts/ItemResolverDecorationContext'
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

export class ChatMessage extends React.Component<SlackMessageProps> {
  static contextType = ItemResolverDecorationContext

  render() {
    const { item, extraProps = {}, message, renderText, previousMessage } = this.props
    const decoration = this.context
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

    let content
    if (renderText) {
      content = renderText(message.text)
      console.log('returning content', content)
    } else if (extraProps.condensed) {
      content = (
        <HighlightText ellipse {...decoration.text}>
          {message.text}
        </HighlightText>
      )
    } else {
      content = (
        <Text
          selectable={!extraProps.preventSelect}
          ellipse={extraProps.condensed ? true : null}
          {...decoration.text}
        >
          <Markdown className="slack-markdown" source={message.text} />
        </Text>
      )
    }

    return (
      <SlackMessageFrame condensed={extraProps.condensed} {...decoration.item}>
        {!hideHeader && (
          <Row
            alignItems="center"
            userSelect="none"
            cursor="default"
            padding={[extraProps.condensed ? 0 : 3, 0]}
          >
            {extraProps.beforeTitle || null}
            {!!person && (
              <RoundButtonPerson
                hideAvatar={extraProps.condensed}
                background="transparent"
                person={person}
              />
            )}
            {!extraProps.condensed && (
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
}
