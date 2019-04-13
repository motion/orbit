import orbit from '!raw-loader!../../public/images/orbit-logo.svg'
import { gloss, useTheme } from '@o/gloss'
import { SVG } from '@o/kit'
import { Space, View, ViewProps } from '@o/ui'
import React, { memo } from 'react'
import { useNavigation } from 'react-navi'
import mark from '../../public/images/orbit-mark.svg'
import { useScreenSize } from '../hooks/useScreenSize'
import { Overdrive } from './Overdrive'

let logoScales = {
  small: 0.5,
  medium: 0.75,
  large: 1,
}

export const LogoVertical = memo(
  ({ size, ...rest }: ViewProps & { size?: 'small' | 'medium' | 'large' }) => {
    const theme = useTheme()
    const screenSize = useScreenSize()
    const nav = useNavigation()
    const scale = logoScales[size || screenSize]

    return (
      <Overdrive id="logo-vertical">
        <View
          position="relative"
          zIndex={100000}
          cursor="pointer"
          alignItems="center"
          justifyContent="center"
          transform={{ scale }}
          padding={[0, 20]}
          onClick={() => {
            nav.navigate('/')
          }}
          {...rest}
        >
          <Image src={mark} />
          <Space />
          <SVG cleanup fill={theme.color} width={102} height={23} svg={orbit} />
        </View>
      </Overdrive>
    )
  },
)

const Image = gloss(View)

Image.defaultProps = {
  tagName: 'img',
}
