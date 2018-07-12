import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import slackDown from '@mcro/slackdown'
import { getSlackDate } from '../../helpers'
import { TimeAgo } from '../../views/TimeAgo'
import { Bit } from '@mcro/models'
import { RoundButtonPerson } from '../../views/RoundButtonPerson'

type SlackMessageObj = { name: string; text: string; user: string; ts: string }

type SlackMessageProps = {
  bit: Bit
  message: SlackMessageObj
  previousMessage?: SlackMessageObj
  itemProps?: Object
}

@view
export class SlackMessage extends React.Component<SlackMessageProps> {
  render() {
    const { bit, message, previousMessage, itemProps } = this.props
    if (!message.text || !bit) {
      log(`no messagetext/bit ${JSON.stringify(message)}`)
      return null
    }
    let htmlText = message.text
    try {
      htmlText = slackDown(message.text)
    } catch (err) {
      console.log('err parsing', err)
    }
    const person = (bit.people || []).find(
      person => person.integrationId === message.user,
    )
    if (!person) {
      log(`no person for message ${message.text}`)
      return null
    }
    let previousBySameAuthor = false
    let previousWithinOneMinute = false
    if (previousMessage) {
      previousBySameAuthor = message.user === previousMessage.user
      previousWithinOneMinute = +message.ts - +previousMessage.ts < 1000 * 60
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
          padding={[5, 0]}
          userSelect="none"
          cursor="default"
        >
          <RoundButtonPerson person={person} />
          <space />
          <date if={!previousMessage || !previousWithinOneMinute}>
            <TimeAgo if={message.ts}>{getSlackDate(message.ts)}</TimeAgo>
          </date>
        </UI.Row>
        <UI.Row>
          <content dangerouslySetInnerHTML={{ __html: htmlText }} />
        </UI.Row>
      </UI.Col>
    )
  }

  static style = {
    date: {
      fontSize: '75%',
      fontWeight: 300,
      opacity: 0.45,
      marginTop: 1,
      marginBottom: -1,
      lineHeight: '1rem',
    },
    space: {
      width: 6,
    },
    content: {
      width: '100%',
      display: 'block',
      position: 'relative',
      margin: [1, 0, 0],
      userSelect: 'auto',
      wordWrap: 'break-word',
    },
  }
}
