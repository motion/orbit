import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'

@view
export default class SlackMessage {
  render({ bit, message, previousMessage }) {
    if (!message.text || !bit) {
      log(`no messagetext/bit ${JSON.stringify(message)}`)
      return null
    }
    if (message.text.indexOf('uploaded a file') >= 0) {
      const src = message.text.match(/\<([a-z]+:\/\/[^>]+)\>/g).map(link =>
        link
          .slice(1, link.length)
          .slice(0, link.length - 2)
          .replace(/\|.*$/g, ''),
      )[0]
      console.log('src', src)
      return (
        <div $$flex>
          image
          <img src={src} css={{ maxWidth: '100%' }} />
        </div>
      )
    }
    const person = bit.people.find(
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
    // const [firstWord, ...rest] = message.text.split(' ')
    return (
      <message>
        <header if={!hideHeader}>
          <img $avatar if={avatar} src={avatar} />
          <space />
          <username>{message.name}</username>
          <space />
          <date>
            <UI.Date>{new Date(message.ts.split('.')[0] * 1000)}</UI.Date>
          </date>
        </header>
        <content>{message.text}</content>
      </message>
    )
  }
  static style = {
    message: {
      padding: [5, 0, 0],
    },
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      margin: [3, 0, 5],
    },
    username: {
      fontWeight: 600,
      fontSize: 14,
      color: '#000',
    },
    date: {
      marginBottom: -1,
      fontSize: 12,
      fontWeight: 300,
      opacity: 0.45,
    },
    space: {
      width: 6,
    },
    avatar: {
      borderRadius: 100,
      width: 16,
      height: 16,
    },
    content: {
      display: 'block',
      position: 'relative',
      // color: '#000',
      // '&::first-letter': {
      //   fontWeight: 400,
      //   fontSize: 18,
      // },
    },
    firstWord: {
      fontWeight: 400,
      // background: [0, 0, 0, 0.05],
      // borderRadius: 2,
      // borderBottom: [1, [0, 0, 0, 0.1]],
      display: 'inline',
    },
  }
}
