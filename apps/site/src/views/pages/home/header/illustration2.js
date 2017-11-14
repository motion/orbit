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
          planetSize={60}
          hideRings={{
            0: true,
          }}
          planetStyles={{
            background: '#fff',
            border: [1, Constants.colorMain],
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
            'github-icon',
            'bitbucket',
            'jira',
            'markdown',
            'medium',
            'microsoft',
            'office',
          ]}
          css={{
            top: -220,
            left: 320,
            transform: {
              scale: 0.5,
            },
          }}
        />

        <stage
          css={{
            flexFlow: 'row',
            alignItems: 'flex-end',
            margin: [0, 'auto', -20],
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
                margin: [-260, 120, 0, -110],
                width: 140,
                height: 140,
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
                marginLeft: 100,
                alignSelf: 'flex-end',
                transform: { scaleX: -1 },
              }}
            />
          </figure>
        </stage>

        <floor
          css={{
            position: 'absolute',
            bottom: 10,
            left: 120,
            right: 90,
            flexFlow: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-around',
          }}
        >
          <img
            src="/figures/Lavender.svg"
            css={{ width: 80, height: 80, opacity: 0 }}
          />

          <img
            if={false}
            src="/figures/Pinecomb.svg"
            css={{
              width: 80,
              height: 80,
              transform: { rotate: '-25deg' },
            }}
          />
        </floor>
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
