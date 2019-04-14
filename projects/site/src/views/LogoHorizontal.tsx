import orbit from '!raw-loader!../../public/images/logomark-solid.svg'
import { gloss, useTheme } from '@o/gloss'
import { SVG } from '@o/kit'
import { View, ViewProps } from '@o/ui'
import React, { memo } from 'react'
import { useNavigation } from 'react-navi'
import { Overdrive } from './Overdrive'

export const LogoHorizontal = memo((props: ViewProps) => {
  const theme = useTheme()
  const { navigate } = useNavigation()
  const scaleDown = 0.3333

  return (
    <Overdrive id="logo-horizontal" style={{ flex: 0 }}>
      <View
        color={theme.color.toString()}
        cursor="pointer"
        alignItems="center"
        justifyContent="center"
        padding={[2, 20]}
        transform={{
          y: -2,
          x: -4,
        }}
        onClick={() => {
          navigate('Home')
        }}
        zIndex={100000}
        {...props}
      >
        <SVG width={`${313 * scaleDown}px`} height={`${96 * scaleDown}px`} svg={orbit} />
      </View>
    </Overdrive>
  )
})

const Image = gloss(View)

Image.defaultProps = {
  tagName: 'img',
}
