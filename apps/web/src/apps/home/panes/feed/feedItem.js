import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as FeedItems from './feedItems'

@view
export default class FeedItem {
  render({ inline, index, hideName, event, style }) {
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
      <GetFeedItem inline={inline} event={event}>
        {({ name, verb, avatar, extraInfo, body }) => {
          return (
            <feeditem style={style}>
              <fade if={index === 0} />
              <sideLine />
              <bottomLine />
              <info>
                <avatar
                  css={{
                    background: `url(${avatar})`,
                    backgroundSize: 'cover',
                  }}
                />
                <UI.Icon
                  $icon
                  size={24}
                  name={event.integration}
                  color={UI.color(event.integrationColor).lightness(70)}
                />
                <text>
                  <UI.Text $name if={!hideName}>
                    {name}{' '}
                  </UI.Text>
                  <UI.Text $action>{verb} </UI.Text>
                  {extraInfo || null}
                </text>

                <div $$flex={1} />
                <after>
                  <UI.Date $date>{event.updated || event.created}</UI.Date>
                  <UI.Icon
                    $typeIcon
                    size={16}
                    opacity={0.4}
                    name={event.type}
                  />
                </after>
              </info>
              <body if={body && !inline}>
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
    sideLine: {
      width: 1,
      background: '#eee',
      position: 'absolute',
      top: 0,
      left: 42,
      bottom: 0,
      zIndex: -2,
    },
    bottomLine: {
      opacity: 0,
      height: 1,
      background: 'linear-gradient(to right, #eee, transparent)',
      position: 'absolute',
      bottom: 0,
      left: 42,
      right: 0,
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
      marginRight: 5,
    },
    text: {
      flexFlow: 'row',
      alignItems: 'center',
      margin: [0, 5],
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
      margin: [0, 5],
    },
    typeIcon: {
      marginLeft: 10,
      marginRight: 5,
    },
  }

  static theme = props => {
    if (props.inline) {
      return {
        feeditem: {
          padding: 0,
        },
        avatar: {
          width: 14,
          height: 14,
          marginRight: 4,
        },
        info: {
          flexWrap: 'nowrap',
        },
        sideLine: {
          display: 'none',
        },
        icon: {
          display: 'none',
        },
        typeIcon: {
          display: 'none',
        },
        name: {
          fontSize: 12,
        },
        action: {
          fontSize: 12,
        },
        date: {
          fontSize: 12,
        },
      }
    }
    return {}
  }
}
