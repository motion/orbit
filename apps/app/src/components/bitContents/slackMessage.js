import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { RoundButton } from '~/views'
import slackDown from '@mcro/slackdown'
import * as PeekStateActions from '~/actions/PeekStateActions'
import { getSlackDate } from '~/helpers'
import { TimeAgo } from '~/views/TimeAgo'

@view
export class BitSlackMessage extends React.Component {
  render({ bit, message, previousMessage, contentStyle }) {
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
    const avatar = person.data.profile.image_48
    return (
      <message>
        <topSpace if={!hideHeader && previousMessage} css={{ height: 14 }} />
        <header if={!hideHeader}>
          <RoundButton
            onClick={e => {
              e.stopPropagation()
              PeekStateActions.selectPerson(person)
            }}
          >
            <inner>
              <img $avatar if={avatar} src={avatar} />
              <username>{message.name}</username>
            </inner>
          </RoundButton>
          <space />
          <date if={!previousMessage || !previousWithinOneMinute}>
            <TimeAgo if={message.ts}>{getSlackDate(message.ts)}</TimeAgo>
          </date>
        </header>
        <content
          css={contentStyle}
          dangerouslySetInnerHTML={{ __html: htmlText }}
        />
      </message>
    )
  }

  static style = {
    message: {
      padding: [2, 0, 0],
    },
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      margin: [0, 0, 2, -2],
      userSelect: 'none',
      cursor: 'default',
    },
    inner: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    username: {
      fontWeight: 400,
      fontSize: 14,
      color: '#000',
      margin: [0, 0, 1],
      alignItems: 'center',
    },
    date: {
      fontSize: 12,
      fontWeight: 300,
      opacity: 0.45,
      marginTop: 1,
      marginBottom: -1,
      lineHeight: '1rem',
    },
    space: {
      width: 6,
    },
    avatar: {
      borderRadius: 100,
      width: 15,
      height: 15,
      marginRight: 5,
      marginLeft: -1,
    },
    content: {
      fontSize: 15,
      lineHeight: '1.25rem',
      display: 'block',
      position: 'relative',
      margin: [1, 0, 0],
      userSelect: 'auto',
      wordWrap: 'break-word',
    },
  }
}
