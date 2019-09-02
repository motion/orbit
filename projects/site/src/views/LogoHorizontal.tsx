import orbit from '!raw-loader!../../public/images/logomark-solid.svg'
import { View, ViewProps } from '@o/ui'
import { gloss, useTheme } from 'gloss'
import React, { memo } from 'react'

import { useLink } from '../useLink'

export const LogoHorizontal = memo((props: ViewProps & { slim?: boolean }) => {
  const theme = useTheme()
  const scaleDown = 0.08 + (props.slim ? 0 : 0.075)
  const w = 1441
  const h = 442

  return (
    <View
      color={theme.color.toString()}
      cursor="pointer"
      alignItems="center"
      justifyContent="center"
      padding={[0, 20]}
      margin={[0, 0]}
      transform={{
        x: 2,
        y: -2,
        scale: scaleDown,
      }}
      width={w * scaleDown}
      height={h * scaleDown}
      zIndex={100000}
      {...useLink('/')}
      {...props}
    >
      <svg
        width={`${w}px`}
        height={`${h}px`}
        dangerouslySetInnerHTML={{
          __html: orbit.replace('fill="#000000"', 'fill="currentColor"'),
        }}
      />
    </View>
  )
})

const Image = gloss(View)

Image.defaultProps = {
  tagName: 'img',
}
