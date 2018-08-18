import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import slackDown from '@mcro/slackdown'
import { Bit, SlackBitDataMessage } from '@mcro/models'
import { RoundButtonPerson } from '../../../views/RoundButtonPerson'
import { TimeAgo } from '../../../views/TimeAgo'

type SlackMessageProps = {
  bit: Bit
  message: SlackBitDataMessage
  previousMessage?: SlackBitDataMessage
  itemProps?: Object
  highlight?: Object
}

const SlackMessageInner = view({
  padding: [0, 0, 0, 14],
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
        {!hideHeader && (
          <UI.Row
            flexFlow="row"
            alignItems="center"
            margin={[0, 0, 2, -2]}
            padding={[2, 0]}
            userSelect="none"
            cursor="default"
          >
            {!!person && <RoundButtonPerson person={person} />}
            <div style={{ width: 6 }} />
            {(!previousMessage || !previousWithinOneMinute) && (
              <UI.Text>{<TimeAgo date={new Date(message.time)} />}</UI.Text>
            )}
          </UI.Row>
        )}
        <SlackMessageInner>
          <UI.Text className="searchable-item" renderAsHtml>
            {htmlText.replace('``', '')}
          </UI.Text>
        </SlackMessageInner>
      </UI.Col>
    )
  }
}
