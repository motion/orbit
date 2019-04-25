import orbit from '!raw-loader!../../public/images/logomark-solid.svg'
import { gloss, useTheme } from '@o/gloss'
import { SVG, View, ViewProps } from '@o/ui'
import React, { memo } from 'react'
import { Link } from 'react-navi'

import { Overdrive } from './Overdrive'

export const LogoHorizontal = memo((props: ViewProps & { slim?: boolean }) => {
  const theme = useTheme()
  const scaleDown = 0.38 + (props.slim ? 0 : 0.075)

  return (
    <Overdrive id="logo">
      <View
        color={theme.color.toString()}
        cursor="pointer"
        alignItems="center"
        justifyContent="center"
        padding={[0, 20]}
        margin={[0, 0]}
        transform={{
          x: '-0.5%',
          y: -2,
        }}
        zIndex={100000}
        {...props}
      >
        <Link href="/">
          <SVG width={`${313 * scaleDown}px`} height={`${96 * scaleDown}px`} svg={orbit} />
        </Link>
      </View>
    </Overdrive>
  )
})

const Image = gloss(View)

Image.defaultProps = {
  tagName: 'img',
}
