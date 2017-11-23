import { view } from '@mcro/black'
import * as React from 'react'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

export const Slant = ({ inverse, background = '#fff' }) => (
  <slant
    $$fullscreen
    css={{
      top: 0,
      bottom: 0,
      right: inverse ? '50%' : '-150%',
      left: inverse ? '-150%' : '50%',
      zIndex: 1,
    }}
  >
    <div
      css={{
        position: 'absolute',
        background,
        top: 0,
        left: inverse ? 'auto' : 0,
        right: inverse ? 0 : 'auto',
        bottom: 0,
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

export const Text = props => <UI.Text size={1.5} marginBottom={20} {...props} />

export const SubText = props => (
  <Text size={1.25} lineHeight="1.7rem" {...props} />
)

export const Hl = props => (
  <UI.Text
    display="inline"
    padding={[3]}
    background={'rgb(98.4%, 97.1%, 77.3%)'}
    {...props}
  />
)

export const Title = props => <Text fontWeight={800} {...props} />

export const SubTitle = props => (
  <UI.Title
    size={2.2}
    fontWeight={200}
    marginBottom={30}
    opacity={0.6}
    {...props}
  />
)

const dark = {
  background: `linear-gradient(40deg, ${Constants.colorMain}, ${
    Constants.colorSecondary
  })`,
}
const space = {
  background: '#222',
}
const padRight = {
  paddingRight: 380,
  [Constants.screen.small]: {
    paddingRight: 0,
  },
}

export const Section = view(
  'section',
  {
    marginLeft: -100,
    marginRight: -100,
    paddingLeft: 100,
    paddingRight: 100,
    position: 'relative',
    //overflow: 'hidden',
  },
  {
    padded: {
      padding: [110, 0],
      margin: 0,
    },
    dark,
    space,
  }
)

export const SectionContent = view(
  'section',
  {
    width: '85%',
    minWidth: 300,
    maxWidth: Constants.smallSize,
    margin: [0, 'auto'],
    transform: {
      z: 0,
    },
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
      height: Math.min(1200, window.innerHeight - 5),
    },
  }
)

export const Content = view(
  'div',
  {},
  {
    padRight,
  }
)

export const Hr = view('hr', {
  display: 'flex',
  height: 0,
  border: 'none',
  borderTop: [1, [0, 0, 0, 0.05]],
  paddingBottom: 20,
  marginTop: 20,
})

export const BottomSlant = view(
  'div',
  {
    position: 'absolute',
    bottom: -350,
    left: -500,
    right: -500,
    height: 400,
    transform: {
      rotate: '-1deg',
    },
  },
  {
    dark,
  }
)

export const Link = view('a', {
  color: Constants.colorMain,
  fontWeight: 500,
  // textDecoration: 'underline',
})

export const Strong = view('strong', {
  fontWeight: 500,
})

export const List = view('ol', {
  '& > li': {
    listStylePosition: 'auto',
    listStyleType: 'decimal',
    margin: [0, 0, 15, 30],
  },
})
