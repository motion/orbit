import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import slackDown from '@mcro/slackdown'
import { Bit, SlackBitDataMessage } from '@mcro/models'
import { RoundButtonPerson } from '../../../views/RoundButtonPerson'
import { DateFormat } from '../../../views/DateFormat'

type SlackMessageProps = {
  bit: Bit
  message: SlackBitDataMessage
  previousMessage?: SlackBitDataMessage
  itemProps?: Object
}

const DateView = view({
  fontSize: '75%',
  fontWeight: 300,
  opacity: 0.45,
  marginTop: 1,
  marginBottom: -1,
  lineHeight: '1rem',
})

const Content = view({
  width: '100%',
  display: 'block',
  position: 'relative',
  margin: [1, 0, 0],
  userSelect: 'auto',
  wordWrap: 'break-word',
  fontSize: 16,
  lineHeight: 20,
})

@view
export class SlackMessage extends React.Component<SlackMessageProps> {
  render() {
    const { bit, message, previousMessage, itemProps } = this.props
    if (!message.text || !bit) {
      console.log(`no messagetext/bit ${JSON.stringify(message)}`)
      return null
    }
    let htmlText = message.text
    try {
      htmlText = slackDown(message.text)
    } catch (err) {
      console.error('err parsing', err)
    }
    const person = (bit.people || []).find(
      person => person.integrationId === message.user,
    )
    let previousBySameAuthor = false
    let previousWithinOneMinute = false
    if (previousMessage) {
      previousBySameAuthor = message.user === previousMessage.user
      previousWithinOneMinute = message.time - previousMessage.time < 1000 * 60 // todo(nate) can you please check it?
    }
    const hideHeader = previousBySameAuthor && previousWithinOneMinute
    return (
      <UI.Col {...itemProps}>
        {/* <topSpace if={!hideHeader && previousMessage} css={{ height: 14 }} /> */}
        <UI.Row
          if={!hideHeader}
          flexFlow="row"
          alignItems="center"
          margin={[0, 0, 2, -2]}
          padding={[2, 0]}
          userSelect="none"
          cursor="default"
        >
          {!!person && <RoundButtonPerson person={person} />}
          <div style={{ width: 6 }} />
          <DateView if={!previousMessage || !previousWithinOneMinute}>
            {<DateFormat date={new Date(message.time)} />}
          </DateView>
        </UI.Row>
        <UI.Row>
          <Content
            className="searchable-item rendered-content"
            dangerouslySetInnerHTML={{ __html: htmlText }}
          />
        </UI.Row>
      </UI.Col>
    )
  }
}
