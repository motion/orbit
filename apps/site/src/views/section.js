import * as React from 'react'
import * as Constants from '~/constants'
import Media from 'react-media'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'

export const Slant = ({
  inverse,
  inverseSlant,
  slantBackground = '#f2f2f2',
  slantGradient,
  rightBackground,
  slantSize = 14,
  amount = 40,
  ...props
}) => {
  const slant =
    Math.atan(amount / (Constants.SECTION_HEIGHT / 2)) * 180 / Math.PI
  const rotate = `${(inverse ? -1 : 1) * (inverseSlant ? -1 : 1) * slant}deg`
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
                background: slantGradient
                  ? `linear-gradient(200deg, ${slantGradient[0]} 5%, ${
                      slantGradient[1]
                    } 95%)`
                  : slantBackground,
                top: -slant * 3,
                bottom: -slant * 3,
                left: inverse ? 'auto' : 0,
                right: inverse ? 0 : 'auto',
                width: slantSize,
                zIndex: slant * 2,
                transformOrigin: 'center right',
                transform: {
                  x: -slantSize / 2,
                  rotate,
                },
              }}
            />
            <div
              if={rightBackground}
              css={{
                position: 'absolute',
                background: rightBackground,
                top: '-15%',
                right: inverse ? slant : '-200%',
                left: inverse ? '-200%' : slant,
                bottom: '-15%',
                zIndex: -1,
                transform: {
                  rotate,
                  x: -1,
                },
              }}
            />
          </slant>
        </slantClip>
      )}
    />
  )
}

@view.ui
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

  static theme = ({ withBackground }, theme) => {
    return {
      section: {
        background: withBackground ? theme.base.background : 'transparent',
      },
    }
  }
}
