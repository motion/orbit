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

export const Slant = ({
  secondary,
  reversed,
  inverse,
  inverseSlant,
  backgroundColor = Constants.gradients.main.background,
  ...props
}) => {
  let background = backgroundColor
  if (secondary) {
    background = Constants.gradients.secondary.background
    if (reversed) {
      background = Constants.gradients.secondary.backgroundInverse
    }
  } else {
    if (reversed) {
      background = Constants.gradients.main.backgroundInverse
    }
  }
  console.log('background', background)
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
      {...props}
    >
      <div
        css={{
          position: 'absolute',
          background:
            background.indexOf('linear') === 0
              ? background.replace(
                  'linear-gradient(',
                  `linear-gradient(${170 + Constants.SLANT}deg, `,
                )
              : background,
          top: -Constants.SLANT_AMT,
          bottom: -Constants.SLANT_AMT,
          left: inverse ? 'auto' : 0,
          right: inverse ? 0 : 'auto',
          width: Constants.SLANT_AMT * 2,
          zIndex: Constants.SLANT_AMT * 2,
          transformOrigin: 'center right',
          transform: {
            rotate: `${(inverse ? -1 : 1) *
              (inverseSlant ? -1 : 1) *
              Constants.SLANT}deg`,
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
    main: {
      background: Constants.gradients.main.background,
    },
    mainReverse: {
      background: Constants.gradients.main.backgroundInverse,
    },
    secondary: {
      background: Constants.gradients.secondary.background,
    },
    secondaryReverse: {
      background: Constants.gradients.secondary.backgroundInverse,
    },
  },
)

export const SectionContent = view(
  'section',
  {
    width: '85%',
    minWidth: 660,
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
  },
)
