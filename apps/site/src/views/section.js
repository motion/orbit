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
  reverseColor,
  inverse,
  inverseSlant,
  backgroundColor,
  rightBackground,
  ...props
}) => {
  let background = backgroundColor
  if (!background) {
    if (reverseColor) {
      background = Constants.colorMain
    } else {
      background = Constants.colorSecondary
    }
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
      {...props}
    >
      <div
        css={{
          position: 'absolute',
          background,
          // opacity: 0.92,
          top: -Constants.SLANT_AMT,
          bottom: -Constants.SLANT_AMT,
          left: inverse ? 'auto' : 0,
          right: inverse ? 0 : 'auto',
          width: Constants.SLANT_AMT * 2,
          zIndex: Constants.SLANT_AMT * 2,
          transformOrigin: 'center right',
          transform: {
            x: -Constants.SLANT_AMT,
            rotate: `${(inverse ? -1 : 1) *
              (inverseSlant ? -1 : 1) *
              Constants.SLANT}deg`,
          },
        }}
      />
      <div
        css={{
          position: 'absolute',
          background: rightBackground,
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
    // zIndex: -2,
  },
  {
    main: {
      background: '#fff',
    },
    mainReverse: {
      background: '#111',
    },
    secondary: {
      background: '#111',
    },
    secondaryReverse: {
      background: '#fff',
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
    overflow: 'hidden',
  },
  {
    padded: {
      padding: [80, 0],
    },
    doublePadded: {
      padding: [120, 0],
    },
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
      // overflow: 'hidden',
      // background: [0, 0, 0, 0.5],
    },
  },
)
