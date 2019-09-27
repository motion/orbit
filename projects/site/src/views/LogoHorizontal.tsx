import orbit from '!raw-loader!../public/images/logomark-solid.svg'
import { SVG, View, ViewProps } from '@o/ui'
import { gloss, useTheme } from 'gloss'
import React, { memo } from 'react'

import { useLink } from '../useLink'

export const LogoHorizontal = memo((props: ViewProps & { slim?: boolean }) => {
  const theme = useTheme()
  const scaleDown = 0.5 + (props.slim ? 0 : 0.5)
  const w = 272
  const h = 71

  return (
    <View
      color={theme.color.toString()}
      cursor="pointer"
      alignItems="center"
      justifyContent="center"
      padding={[0, 20]}
      margin={[0, 0]}
      transform={{
        x: 6,
        y: -2,
        // scale: scaleDown,
      }}
      width={w * scaleDown}
      height={h * scaleDown}
      zIndex={100000}
      {...useLink('/')}
      {...props}
    >
      <SVG
        width={`${w * scaleDown}px`}
        height={`${h * scaleDown}px`}
        svg={orbit.replace('fill="#000000"', 'fill="currentColor"')}
      />
    </View>
  )
})

const Image = gloss(View)

Image.defaultProps = {
  tagName: 'img',
}
