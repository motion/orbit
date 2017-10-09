import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as FeedItems from './feedItems'

@view
export default class FeedItem {
  render({ index, hideName, event, style }) {
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
              <fade if={index === 0} />
              <line />
              <info>
                <avatar
                  css={{
                    background: `url(${avatar})`,
                    backgroundSize: 'cover',
                  }}
                />
                <UI.Text $name if={!hideName}>
                  {name}{' '}
                </UI.Text>
                <UI.Text $action>{verb} </UI.Text>
                {extraInfo || null}

                <div $$flex={1} />
                <after>
                  <UI.Date $date>{event.updated || event.created}</UI.Date>
                  <UI.Icon
                    $typeIcon
                    size={16}
                    opacity={0.4}
                    name={event.type}
                  />
                  <UI.Icon $icon size={24} name={event.integration} />
                </after>
              </info>
              <body if={body}>
                <UI.Text>{body}</UI.Text>
              </body>
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
      padding: [20, 25, 20, 29],
      borderBottom: [1, 'dotted', [0, 0, 0, 0.08]],
    },
    fade: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      height: 50,
      background: 'linear-gradient(#fff, transparent)',
      zIndex: -1,
    },
    line: {
      width: 3,
      background: '#eee',
      position: 'absolute',
      top: 0,
      left: 40,
      bottom: 0,
      zIndex: -2,
    },
    info: {
      flexFlow: 'row',
      flexWrap: 'wrap',
      alignItems: 'center',
      whiteSpace: 'pre',
      fontSize: 15,
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
      width: 26,
      height: 26,
      borderRadius: 100,
      marginRight: 8,
    },
    body: {
      padding: [10, 15],
      fontSize: 16,
    },
    after: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    icon: {
      marginLeft: 10,
    },
    typeIcon: {
      marginLeft: 10,
      marginRight: 5,
    },
  }
}
