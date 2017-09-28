import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as FeedItems from './feedItems'

@view
export default class FeedItem {
  render({ event, style }) {
    const { verb, data } = event
    if (!data) {
      console.log('no data')
      return null
    }
    const { actor } = data
    const GetFeedItem = FeedItems[event.integration]
    return (
      <GetFeedItem event={event}>
        {({ extraInfo, body }) => (
          <feeditem style={style}>
            <info if={actor}>
              <avatar
                css={{
                  background: `url(${actor.avatar_url})`,
                }}
              />
              <UI.Text $name>{actor.login} </UI.Text>
              <UI.Text $action>{verb} </UI.Text>
              {extraInfo}
              <UI.Date $date>{event.updated || event.created}</UI.Date>
            </info>
            <body if={body}>{body}</body>
          </feeditem>
        )}
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
