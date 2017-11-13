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
  planetStyles = PLANET_STYLES,
  items = ITEMS,
  rings = 3,
  ...props
}) => {
  const size = rings * 360
  console.log('render orbital')

  return (
    <orbitals
      css={{
        position: 'absolute',
        left: '50%',
        marginLeft: -size / 2,
        width: size,
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
              background: 'rgba(64.5%, 85.7%, 98.7%, 0.125)',
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
              background: 'rgba(64.5%, 85.7%, 98.7%, 0.125)',
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
              background: 'rgba(64.5%, 85.7%, 98.7%, 0.125)',
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
        {items.map((n, i) => {
          const col = i % rings
          return (
            <contain $$fullscreen key={i}>
              <planet
                css={{
                  borderRadius: 100,
                  // border: [1, orbitLineColor],
                  width: 50,
                  height: 50,
                  margin: 'auto',
                  animation: `orbital${col} ${col * 120 + 50}s linear infinite`,
                  animationDelay: `-${(col + 1 * 2.5) * (i + 1) * 2000}ms`,
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...planetStyles,
                }}
              >
                <img
                  src={`/logos/${n}.svg`}
                  css={{
                    width: 20,
                    height: 20,
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
