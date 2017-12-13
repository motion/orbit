import * as React from 'react'
import * as Constants from '~/constants'
import { view } from '@mcro/black'
import * as Views from '~/views'

@view
export default class Illustration2 {
  render(props) {
    return (
      <things
        $$row
        css={{
          flex: 1,
          marginRight: -70,
          justifyContent: 'center',
          userSelect: 'none',
        }}
        {...props}
      >
        <Views.Orbitals
          rings={2}
          hideRings={{
            0: true,
          }}
          ringBackground="transparent"
          ringBorder={[2, Constants.mainLight]}
          planetSize={100}
          planetStyles={{
            background: '#fff',
            border: [4, Constants.mainLight],
          }}
          items={[
            'google-gmail',
            'google-drive',
            'slack',
            'github',
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
            'base',
            'base',
            '',
            'github',
          ]}
          css={{
            top: '-45%',
            left: 188,
            transformOrigin: 'center center',
            transform: {
              scale: 0.45,
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
              zIndex: 100,
              height: 180,
            }}
          >
            <img
              src="/figures/Hummingbird.svg"
              css={{
                margin: [-250, 0, 0, -90],
                width: 120,
                height: 120,
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
                marginLeft: 75,
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
