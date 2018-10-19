import * as React from 'react'
import { view } from '@mcro/black'
import { SlackBitDataMessage } from '@mcro/models'
import { OrbitAppProps } from '../../../types'
import { View, Row, Text } from '@mcro/ui'
import {
  ItemResolverDecoration,
  ItemResolverDecorationContext,
} from '../../../../helpers/contexts/ItemResolverDecorationContext'
import { RoundButtonPerson } from '../../../../views/RoundButtonPerson'
import { DateFormat } from '../../../../views/DateFormat'
import { HighlightText } from '../../../../views/HighlightText'
import { Markdown } from '../../../../views/Markdown'

type SlackMessageProps = OrbitAppProps<'slack'> & {
  message: SlackBitDataMessage
  previousMessage?: SlackBitDataMessage
  highlight?: Object
}

const SlackMessageFrame = view(View, {
  padding: [0, 0],
  overflow: 'hidden',
})

const SlackMessageInner = view({
  padding: [0, 16],
  flex: 1,
  overflow: 'hidden',
})

export class ChatMessageContent extends React.Component<
  SlackMessageProps & { decoration: ItemResolverDecoration }
> {
  render() {
    const { bit, extraProps = {}, message, previousMessage, hide = {}, decoration } = this.props
    if (!message.text || !bit) {
      return null
    }
    const person = (bit.people || []).find(person => person.integrationId === message.user)
    let previousBySameAuthor = false
    let previousWithinOneMinute = false
    if (previousMessage) {
      previousBySameAuthor = message.user === previousMessage.user
      previousWithinOneMinute = message.time - previousMessage.time < 1000 * 60 // todo(nate) can you please check it?
    }
    const hideHeader = previousBySameAuthor && previousWithinOneMinute
    return (
      <SlackMessageFrame
        {...extraProps.minimal && {
          flexFlow: 'row',
          alignItems: 'center',
        }}
        {...decoration.item}
      >
        {!hideHeader && (
          <Row
            alignItems="center"
            userSelect="none"
            cursor="default"
            padding={[extraProps.minimal ? 0 : 5, 0]}
          >
            {extraProps.beforeTitle || null}
            {!!person && (
              <RoundButtonPerson
                hideAvatar={extraProps.minimal}
                background="transparent"
                person={person}
              />
            )}
            {!extraProps.minimal && (
              <>
                <div style={{ width: 6 }} />
                {!(hide && hide.itemDate) &&
                  (!previousMessage || !previousWithinOneMinute) && (
                    <Text size={0.9} fontWeight={500} alpha={0.5}>
                      {<DateFormat date={new Date(message.time)} />}
                    </Text>
                  )}
              </>
            )}
          </Row>
        )}
        <SlackMessageInner>
          {extraProps.minimal ? (
            <HighlightText ellipse {...decoration.text}>
              {message.text}
            </HighlightText>
          ) : (
            <Text
              selectable={!extraProps.preventSelect}
              ellipse={extraProps.minimal ? true : null}
              {...decoration.text}
            >
              <Markdown className="slack-markdown" source={message.text} />
            </Text>
          )}
        </SlackMessageInner>
      </SlackMessageFrame>
    )
  }
}

export const ChatMessage = props => (
  <ItemResolverDecorationContext.Consumer>
    {decoration => <ChatMessageContent decoration={decoration} {...props} />}
  </ItemResolverDecorationContext.Consumer>
)
