import { view } from '@mcro/black'
import * as React from 'react'
import * as Constants from '~/constants'
import Media from 'react-media'

export const Slant = ({
  inverse,
  inverseSlant,
  slantBackground = '#f2f2f2',
  rightBackground,
  slantSize = 18,
  ...props
}) => {
  return (
    <Media
      query={Constants.screen.large}
      render={() => (
        <slantClip
          $$fullscreen
          css={{
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <slant
            css={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: inverse ? '50%' : '-50%',
              left: inverse ? '-50%' : '50%',
              zIndex: 3,
            }}
            {...props}
          >
            <div
              css={{
                position: 'absolute',
                background: slantBackground,
                // opacity: 0.92,
                top: -Constants.SLANT_AMT,
                bottom: -Constants.SLANT_AMT,
                left: inverse ? 'auto' : 0,
                right: inverse ? 0 : 'auto',
                width: slantSize,
                zIndex: Constants.SLANT_AMT * 2,
                transformOrigin: 'center right',
                transform: {
                  x: -slantSize / 2,
                  rotate: `${(inverse ? -1 : 1) *
                    (inverseSlant ? -1 : 1) *
                    Constants.SLANT}deg`,
                },
              }}
            />
            <div
              if={rightBackground}
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
        </slantClip>
      )}
    />
  )
}

export class Section extends React.Component {
  render() {
    const { leftBackground, inverse, children, ...props } = this.props
    return (
      <section css={{ position: 'relative' }} {...props}>
        <bgTest
          if={leftBackground}
          css={{
            position: 'absolute',
            top: -500,
            left: -500,
            bottom: -500,
            right: '50%',
            zIndex: 0,
            background: leftBackground,
            transform: {
              rotate: inverse ? '-5deg' : '5deg',
            },
          }}
        />
        {children}
      </section>
    )
  }
}

@view
export class SectionContent {
  render({ padded, fullscreen, ...props }) {
    const height = fullscreen
      ? Math.max(980, Math.min(1300, window.innerHeight))
      : 'auto'
    return (
      <section
        $padded={padded}
        $fullscreen={fullscreen}
        css={{ height }}
        {...props}
      />
    )
  }

  static style = {
    section: {
      width: Constants.smallSize,
      margin: [0, 'auto'],
      position: 'relative',
      [Constants.screen.smallQuery]: {
        width: '100%',
      },
    },
    padded: {
      padding: [80, 0],
      [Constants.screen.smallQuery]: {
        padding: [50, 30],
      },
    },
    fullscreen: {
      height: Constants.SECTION_HEIGHT,
      [Constants.screen.smallQuery]: {
        height: 'auto',
      },
    },
  }
}
