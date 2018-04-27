import * as React from 'react'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'
import { RoundButton } from '~/views'
import { App } from '@mcro/all'

const linkRegex = /\<([a-z]+:\/\/[^>]+)\>/
const getLink = x => {
  const match = x.text && x.text.match(linkRegex)
  if (match && match.length) {
    return match[1]
  }
  return null
}

@view
export default class BitSlackMessage {
  render({ bit, message, previousMessage, appStore, contentStyle }) {
    if (!message.text || !bit) {
      log(`no messagetext/bit ${JSON.stringify(message)}`)
      return null
    }
    let content
    const link = getLink(message)
    if (link && link.indexOf('.png')) {
      console.log('attachment', link)
      content = (
        <miniImg>
          <img src={link} />
        </miniImg>
      )
    }
    if (link) {
      console.log('link', link)
      content = <a href={link}>{link}</a>
    }
    if (message.text.indexOf('uploaded a file') >= 0) {
      const src = message.text.match(/\<([a-z]+:\/\/[^>]+)\>/g).map(link =>
        link
          .slice(1, link.length)
          .slice(0, link.length - 2)
          .replace(/\|.*$/g, ''),
      )[0]
      console.log('src', src)
      content = (
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
          <RoundButton
            onClick={e => {
              e.stopPropagation()
              App.setSelectedItem({
                id: person.id,
                icon: avatar,
                title: message.name,
                body: '',
                type: 'person',
                integration: '',
              })
              appStore.pinSelected()
            }}
          >
            <inner>
              <img $avatar if={avatar} src={avatar} />
              <username>{message.name}</username>
            </inner>
          </RoundButton>
          <space />
          <date if={!previousMessage || !previousWithinOneMinute}>
            <UI.Date>{new Date(message.ts.split('.')[0] * 1000)}</UI.Date>
          </date>
        </header>
        <content css={contentStyle}>{content || message.text}</content>
      </message>
    )
  }

  static style = {
    message: {
      padding: [3, 0, 0],
    },
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      margin: [4, 0],
      userSelect: 'none',
      cursor: 'default',
    },
    inner: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    username: {
      fontWeight: 600,
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
      width: 16,
      height: 16,
      marginRight: 3,
      marginLeft: -1,
    },
    content: {
      fontSize: 15,
      lineHeight: '1.25rem',
      display: 'block',
      position: 'relative',
      margin: [2, 0],
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
