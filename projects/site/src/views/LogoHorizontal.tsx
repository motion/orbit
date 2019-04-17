import orbit from '!raw-loader!../../public/images/logomark-solid.svg'
import { gloss, useTheme } from '@o/gloss'
import { SVG } from '@o/kit'
import { View, ViewProps } from '@o/ui'
import React, { memo } from 'react'
import { Link } from 'react-navi'

export const LogoHorizontal = memo((props: ViewProps) => {
  const theme = useTheme()
  const scaleDown = 0.3333

  return (
    <View
      color={theme.color.toString()}
      cursor="pointer"
      alignItems="center"
      justifyContent="center"
      padding={[0, 20]}
      margin={[-4, 0]}
      transform={{
        x: -2,
        y: -2,
      }}
      zIndex={100000}
      {...props}
    >
      <Link href="/">
        <SVG width={`${313 * scaleDown}px`} height={`${96 * scaleDown}px`} svg={orbit} />
      </Link>
    </View>
  )
})

const Image = gloss(View)

Image.defaultProps = {
  tagName: 'img',
}
