import * as React from 'react'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'
import { range } from 'lodash'

const orbitLineColor = UI.color(Constants.colorMain).lighten(0.45)

const ITEMS = [
  'google-gmail',
  'google-drive',
  'asana',
  'base',
  'box',
  'confluence',
  'discord',
  'dropbox',
  'facebook',
  'frontapp',
  'github-icon',
  'gitter',
  'hipchat',
  'hubspot',
  'jira',
  'markdown',
  'medium',
  'microsoft',
  'office',
  'quora',
  'salesforce',
  'slack',
  'trello',
  'zendesk',
  'angellist',
  'shopify',
  'twitter',
  'bitbucket',
]

const PLANET_STYLES = {
  background: Constants.colorMain,
}

export default ({
  ringBackground = 'rgba(64.5%, 85.7%, 98.7%, 0.125)',
  planetSize = 50,
  hideRings = {},
  planetStyles = PLANET_STYLES,
  items = ITEMS,
  rings = 3,
  ...props
}) => {
  const size = rings * 360
  const itemsPerRing = items / rings

  return (
    <orbitals
      css={{
        position: 'absolute',
        left: '50%',
        marginLeft: -size / 2,
        width: size,
        transform: {
          z: 0,
        },
      }}
      {...props}
    >
      <inner
        css={{
          position: 'absolute',
          height: size,
          width: size,
          zIndex: 100,
        }}
      >
        {range(rings).map(ring => (
          <contain key={ring} $$fullscreen>
            <circle
              css={{
                margin: 'auto',
                border: [1, orbitLineColor],
                width: ring * 300,
                height: ring * 300,
                background: ringBackground,
                borderRadius: 1000000000,
              }}
            />

            {range(itemsPerRing)
              .map(i => i * (ring + 1))
              .map(itemIndex => {
                const item = items[itemIndex]
                let col = itemIndex % rings
                if (!item || hideRings[col]) {
                  return null
                }
                const scale = Math.min(1, (col + 1.5) / rings)
                return (
                  <planet
                    css={{
                      borderRadius: 100,
                      width: planetSize * scale,
                      height: planetSize * scale,
                      margin: 'auto',
                      animation: `orbital${col} ${col * 120 +
                        50}s linear infinite`,
                      animationDelay: `-${(col + 1 * 2.5) * (i + 1) * 3000}ms`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      // transform: { scale },
                      ...planetStyles,
                    }}
                  >
                    <img
                      src={`/logos/${item}.svg`}
                      css={{
                        width: planetSize * 0.5 * scale,
                        height: planetSize * 0.5 * scale,
                      }}
                    />
                  </planet>
                )
              })}
          </contain>
        ))}
      </inner>
    </orbitals>
  )
}
