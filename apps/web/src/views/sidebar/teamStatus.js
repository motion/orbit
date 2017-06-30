// @flow
import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import rc from 'randomcolor'
import sillyname from 'sillyname'

@view
export default class TeamStatus {
  items = [
    {
      name: 'SB',
      status: '#brainstorm: features and user feedback strategy',
      time: '10m',
    },
    {
      name: 'NW',
      status:
        'editor: performance/stability: general perf, less saving: save only on debounce(1000)',
      time: '10m',
    },
    {
      name: 'NC',
      status: 'editor: formatting: #uxlove + #dev',
      time: '10m',
    },
    {
      name: 'JB',
      status: '#brainstorm: features and user feedback strategy',
      time: '10m',
    },
  ]

  render() {
    return (
      <team>
        {this.items.map(player =>
          <player key={player.name}>
            <title>
              <UI.Badge
                $badge
                labelBefore
                fontFamily="monospace"
                color={rc({ luminosity: 'light' })}
                label={sillyname().slice(0, 15).toLowerCase()}
              >
                {player.name}
              </UI.Badge>
              <UI.Text size={0.8}>
                {player.time}
              </UI.Text>
            </title>
            <UI.Text>
              {player.status}
            </UI.Text>
          </player>
        )}
      </team>
    )
  }
  static style = {
    team: {
      flexFlow: 'row',
      flexWrap: 'wrap',
    },
    player: {
      padding: [5, 10],
      flex: 1,
      width: '100%',
      minWidth: '100%',
      borderTop: [1, [255, 255, 255, 0.05]],
    },
    title: {
      flexFlow: 'row',
    },
    badge: {
      marginRight: 5,
    },
    info: {
      flexFlow: 'row',
      justifyContent: 'space-between',
      padding: [5, 0],
      fontSize: 12,
      lineHeight: '17px',
      flex: 1,
    },
    time: {
      fontSize: 10,
      opacity: 0.2,
    },
  }
}
