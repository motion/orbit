import { view } from '@mcro/black'
import * as React from 'react'
// import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

const padRight = {
  paddingRight: 380,
  [Constants.screen.small]: {
    paddingRight: 0,
  },
}

export const Slant = ({ dark, inverse, backgroundColor = '#fff' }) => {
  let background = backgroundColor
  if (dark) {
    background = inverse
      ? Constants.darkBackgroundInverse
      : Constants.darkBackground
  }
  return (
    <slant
      $$fullscreen
      css={{
        top: 0,
        bottom: 0,
        right: inverse ? '50%' : '-50%',
        left: inverse ? '-50%' : '50%',
        zIndex: 1,
      }}
    >
      <div
        css={{
          position: 'absolute',
          background:
            background.indexOf('linear') === 0
              ? background.replace(
                  'linear-gradient(',
                  `linear-gradient(${170 + Constants.SLANT}deg, `
                )
              : background,
          top: -20,
          bottom: -20,
          left: inverse ? 'auto' : 0,
          right: inverse ? 0 : 'auto',
          width: Constants.SLANT_AMT * 2,
          zIndex: Constants.SLANT_AMT * 2,
          transformOrigin: 'center right',
          transform: {
            rotate: `${(inverse ? -1 : 1) * Constants.SLANT}deg`,
          },
        }}
      />
      <div
        css={{
          position: 'absolute',
          background,
          top: 0,
          right: inverse ? Constants.SLANT_AMT : '-200%',
          left: inverse ? '-200%' : Constants.SLANT_AMT,
          bottom: 0,
        }}
      />
    </slant>
  )
}

export const Section = view(
  'section',
  {
    position: 'relative',
    overflow: 'hidden',
  },
  {
    padded: {
      padding: [110, 0],
      margin: 0,
    },
    dark: Constants.dark,
  }
)

export const SectionContent = view(
  'section',
  {
    width: '85%',
    minWidth: 300,
    maxWidth: Constants.smallSize,
    margin: [0, 'auto'],
    position: 'relative',
  },
  {
    padRight,
    padBottom: {
      paddingBottom: 80,
    },
    row: {
      flexFlow: 'row',
      alignItems: 'center',
    },
    fullscreen: {
      height: Constants.SECTION_HEIGHT,
    },
  }
)
