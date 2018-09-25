import * as React from 'react'
import * as Constants from '~/constants'
import Media from 'react-media'
import * as UI from '@mcro/ui'
import { view } from '@mcro/black'

export const Slant = ({
  inverse = false,
  inverseSlant = false,
  slantBackground = '#f2f2f2',
  slantGradient = null,
  rightBackground = null,
  slantSize = 14,
  amount = 40,
  ...props
}) => {
  const slant = (Math.atan(amount / (Constants.SECTION_HEIGHT / 2)) * 180) / Math.PI
  const rotate = `${(inverse ? -1 : 1) * (inverseSlant ? -1 : 1) * slant}deg`
  let gradients = []
  if (slantGradient) {
    const all = [...slantGradient]
    // first
    gradients[0] = all.shift()
    // last
    gradients[2] = all.pop()
    // middle
    gradients[1] = all
  }
  return (
    <Media
      query={Constants.screen.large}
      render={() => (
        <UI.FullScreen
          {...{
            overflow: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <UI.View
            {...{
              position: 'absolute',
              top: 0,
              bottom: 0,
              right: inverse ? '50%' : '-50%',
              left: inverse ? '-50%' : '50%',
              zIndex: 3,
            }}
            {...props}
          >
            <UI.View
              {...{
                position: 'absolute',
                background: slantGradient
                  ? `linear-gradient(200deg, ${gradients[0]} 5%, ${
                      gradients[1].length ? gradients[1].join(', ') + ',' : ''
                    } ${gradients[2]} 95%)`
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
            {rightBackground && (
              <UI.View
                {...{
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
            )}
          </UI.View>
        </UI.FullScreen>
      )}
    />
  )
}

const SectionFrame = view({
  position: 'relative',
}).theme(({ withBackground, theme }) => ({
  background: withBackground ? theme.background : 'transparent',
}))

export const Section = ({ withBackground, leftBackground, inverse, children, ...props }) => {
  return (
    <SectionFrame withBackground={withBackground} {...props}>
      {leftBackground && (
        <UI.View
          {...{
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
      )}
      {children}
    </SectionFrame>
  )
}
