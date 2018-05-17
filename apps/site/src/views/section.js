import { view } from '@mcro/black'
import * as React from 'react'
import * as Constants from '~/constants'
import Media from 'react-media'
import { debounce } from 'lodash'

export const Slant = ({
  inverse,
  inverseSlant,
  slantBackground = '#f2f2f2',
  rightBackground,
  slantSize = 16,
  amount = 40,
  ...props
}) => {
  const slant =
    Math.atan(amount / (Constants.SECTION_HEIGHT / 2)) * 180 / Math.PI
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
                top: -slant,
                bottom: -slant,
                left: inverse ? 'auto' : 0,
                right: inverse ? 0 : 'auto',
                width: slantSize,
                zIndex: slant * 2,
                transformOrigin: 'center right',
                transform: {
                  x: -slantSize / 2,
                  rotate: `${(inverse ? -1 : 1) *
                    (inverseSlant ? -1 : 1) *
                    slant}deg`,
                },
              }}
            />
            <div
              if={rightBackground}
              css={{
                position: 'absolute',
                background: rightBackground,
                top: 0,
                right: inverse ? slant : '-200%',
                left: inverse ? '-200%' : slant,
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
  state = {
    resize: false,
  }

  componentDidMount() {
    this.on(
      window,
      'resize',
      debounce(() => {
        this.setState({ resize: Math.random() })
      }, 1000),
    )
  }

  render({ padded, fullscreen, ...props }) {
    const isSmall = window.innerWidth <= Constants.screen.small.maxWidth
    const height = fullscreen
      ? Math.max(
          isSmall ? 500 : 1000,
          Math.min(Constants.sectionMaxHeight, window.innerHeight),
        )
      : 'auto'
    const style = isSmall ? { minHeight: height } : { height }
    return (
      <section
        $padded={padded}
        $fullscreen={fullscreen}
        css={style}
        {...props}
      />
    )
  }

  static style = {
    section: {
      width: '95%',
      minWidth: Constants.smallSize,
      maxWidth: Constants.mediumSize,
      margin: [0, 'auto'],
      position: 'relative',
      [Constants.screen.smallQuery]: {
        width: '100%',
        height: 'auto',
        minWidth: 'auto',
        maxWidth: 'auto',
      },
    },
    padded: {
      padding: [80, 30],
      [Constants.screen.smallQuery]: {
        padding: [80, 30],
      },
    },
  }
}
