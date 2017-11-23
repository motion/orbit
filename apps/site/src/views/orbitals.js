import * as React from 'react'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

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
        <contain $$fullscreen>
          <circle
            css={{
              margin: 'auto',
              border: [1, orbitLineColor],
              width: 100,
              height: 100,
              background: ringBackground,
              borderRadius: 1000000000,
            }}
          />
        </contain>
        <contain if={rings > 0} $$fullscreen>
          <circle
            css={{
              margin: 'auto',
              border: [1, orbitLineColor],
              width: 300,
              height: 300,
              background: ringBackground,
              borderRadius: 1000000000,
              opacity: 0.8,
            }}
          />
        </contain>
        <contain if={rings > 1} $$fullscreen>
          <circle
            css={{
              margin: 'auto',
              border: [1, orbitLineColor],
              background: ringBackground,
              width: 600,
              height: 600,
              borderRadius: 1000000000,
              opacity: 0.7,
            }}
          />
        </contain>
        <contain if={rings > 2} $$fullscreen>
          <circle
            css={{
              margin: 'auto',
              border: [1, orbitLineColor],
              width: 900,
              height: 900,
              borderRadius: 1000000000,
              opacity: 0.3,
            }}
          />
        </contain>
        <contain if={rings > 3} $$fullscreen>
          <circle
            css={{
              margin: 'auto',
              border: [1, orbitLineColor],
              width: 1400,
              height: 1400,
              borderRadius: 1000000000,
              opacity: 0.15,
            }}
          />
        </contain>
        {items.map((item, i) => {
          let col = i % rings
          if (!item || hideRings[col]) {
            return null
          }
          const scale = Math.min(1, (col + 1.5) / rings)
          return (
            <contain $$fullscreen key={i}>
              <planet
                css={{
                  borderRadius: 100,
                  width: planetSize * scale,
                  height: planetSize * scale,
                  margin: 'auto',
                  animation: `orbital${col} ${col * 120 + 50}s linear infinite`,
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
            </contain>
          )
        })}
      </inner>
    </orbitals>
  )
}
