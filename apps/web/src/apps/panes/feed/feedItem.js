import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as FeedItems from './feedItems'

@view
export default class FeedItem {
  render({ event, style }) {
    const { data } = event
    if (!data) {
      console.log('no data')
      return null
    }
    const GetFeedItem = FeedItems[event.type]
    if (!GetFeedItem) {
      return (
        <null>
          no feed item for {event.integration} {event.type}
        </null>
      )
    }
    return (
      <GetFeedItem event={event}>
        {({ name, verb, avatar, extraInfo, body }) => {
          return (
            <feeditem style={style}>
              <info>
                <avatar
                  css={{
                    background: `url(${avatar})`,
                  }}
                />
                <UI.Text $name>{name} </UI.Text>
                <UI.Text $action>{verb} </UI.Text>
                {extraInfo || null}
                <UI.Date $date>{event.updated || event.created}</UI.Date>
              </info>
              <body if={body}>{body}</body>
            </feeditem>
          )
        }}
      </GetFeedItem>
    )
  }

  static style = {
    feeditem: {
      width: '100%',
      justifyContent: 'flex-start',
      overflow: 'hidden',
      padding: [0, 10],
    },
    info: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      whiteSpace: 'pre',
      fontSize: 13,
      height: 40,
    },
    name: {
      fontWeight: 500,
    },
    action: {
      opacity: 0.5,
    },
    date: {
      opacity: 0.5,
    },
    avatar: {
      backgroundSize: 'cover',
      width: 18,
      height: 18,
      borderRadius: 100,
      marginRight: 8,
    },
  }
}
