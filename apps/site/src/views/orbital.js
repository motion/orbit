import * as React from 'react'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

const orbitLineColor = UI.color(Constants.colorMain).lighten(0.45)
const PLANET_STYLES = {
  // background: Constants.colorMain,
}

export default ({
  background = 'transparent',
  size = 600,
  planetSize = 50,
  borderWidth = 1,
  planetStyles = PLANET_STYLES,
  borderColor = orbitLineColor,
  items = [],
  ...props
}) => {
  return (
    <orbital
      css={{
        position: 'absolute',
        height: size,
        width: size,
      }}
      {...props}
    >
      <contain
        css={{ width: size, height: size, position: 'relative' }}
        $$centered
      >
        <circle
          css={{
            margin: 'auto',
            border: [borderWidth, borderColor],
            width: size,
            height: size,
            background: background,
            borderRadius: 1000000000,
          }}
        />

        {items.map((item, i) => {
          return (
            <planet
              css={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                margin: [-planetSize / 2, 0, 0, -planetSize / 2],
                width: planetSize,
                height: planetSize,
                // margin: 'auto',
                animation: `orbit ${500}s linear infinite`,
                animationDelay: `-${32 * (i + 1) * 3000}ms`,
                alignItems: 'center',
                justifyContent: 'center',
                ...planetStyles,
              }}
            >
              {item}
            </planet>
          )
        })}
      </contain>
    </orbital>
  )
}
