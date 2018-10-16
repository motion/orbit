import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { SlackBitDataMessage } from '@mcro/models'
import { RoundButtonPerson } from '../../../views/RoundButtonPerson'
import { View } from '@mcro/ui'
import { DateFormat } from '../../../views/DateFormat'
import { Markdown } from '../../../views/Markdown'
import { HighlightText } from '../../../views/HighlightText'
import { SlackAppProps } from '../slack'

type SlackMessageProps = SlackAppProps & {
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

@view
export class SlackMessage extends React.Component<SlackMessageProps> {
  render() {
    const { bit, extraProps = {}, message, previousMessage, hide = {}, decoration } = this.props
    if (!message.text || !bit) {
      console.log(`no messagetext/bit ${JSON.stringify(message)}`)
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
          <UI.Row
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
                    <UI.Text size={0.9} fontWeight={500} alpha={0.5}>
                      {<DateFormat date={new Date(message.time)} />}
                    </UI.Text>
                  )}
              </>
            )}
          </UI.Row>
        )}
        <SlackMessageInner>
          {extraProps.minimal ? (
            <HighlightText ellipse {...decoration.text}>
              {message.text}
            </HighlightText>
          ) : (
            <UI.Text
              selectable={!extraProps.preventSelect}
              ellipse={extraProps.minimal ? true : null}
              {...decoration.text}
            >
              <Markdown className="slack-markdown" source={message.text} />
            </UI.Text>
          )}
        </SlackMessageInner>
      </SlackMessageFrame>
    )
  }
}
