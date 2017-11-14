import * as React from 'react'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import Orbitals from '../orbitals'

@view
export default class Illustration2 {
  render(props) {
    return (
      <things
        $$row
        css={{
          flex: 1,
          marginRight: -140,
          justifyContent: 'center',
          userSelect: 'none',
        }}
        {...props}
      >
        <Orbitals
          rings={2}
          hideRings={{
            0: true,
          }}
          planetSize={60}
          ringBackground="rgba(64.5%, 85.7%, 98.7%, 0.075)"
          planetStyles={{
            background: '#fff',
            border: [1, Constants.colorMain],
            // filter: 'grayscale(0.5)',
          }}
          items={[
            'google-gmail',
            'google-drive',
            'slack',
            'confluence',
            'zendesk',
            'gitter',
            'intercom',
            'dropbox',
            'quora',
            'trello',
            'bitbucket',
            'jira',
            'markdown',
            'medium',
            'microsoft',
          ]}
          css={{
            top: -165,
            left: 235,
            transform: {
              scale: 0.64,
            },
          }}
        />

        <stage
          css={{
            flexFlow: 'row',
            alignItems: 'flex-end',
            margin: [0, 'auto', -70],
          }}
        >
          <figure
            css={{
              marginRight: -30,
              zIndex: 100,
              height: 180,
            }}
          >
            <img
              if={false}
              src="/figures/Snail.svg"
              css={{
                margin: [0, 0, 0, -150],
                width: 150,
                height: 150,
                zIndex: 1000,
                alignSelf: 'flex-end',
              }}
            />
          </figure>

          <figure
            css={{
              marginRight: -30,
              zIndex: 100,
              height: 180,
            }}
          >
            <img
              src="/figures/Hummingbird.svg"
              css={{
                margin: [-320, 125, 0, -100],
                width: 145,
                height: 145,
                zIndex: 1000,
                alignSelf: 'flex-end',
              }}
            />
          </figure>

          <figure css={{ marginRight: 0, zIndex: 100 }}>
            <img
              src="/figures/Rabbit.svg"
              css={{
                width: 170,
                height: 170,
                marginLeft: 80,
                alignSelf: 'flex-end',
                transform: { scaleX: -1 },
              }}
            />
          </figure>
        </stage>
      </things>
    )
  }

  static style = {
    icon: {
      // border: [1, [0, 0, 255, 0.075]],
      background: [255, 255, 255, 0.1],
      borderRadius: 10,
      opacity: 0.25,
      width: 45,
      height: 45,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 0,
    },
  }
}
