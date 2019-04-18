import orbit from '!raw-loader!../../public/images/orbit-logo.svg'
import { gloss, useTheme } from '@o/gloss'
import { Space, SVG, View, ViewProps } from '@o/ui'
import React, { memo } from 'react'
import { useNavigation } from 'react-navi'
import mark from '../../public/images/orbit-mark.svg'
import { useScreenSize } from '../hooks/useScreenSize'
import { useParallax } from '../pages/HomePage'

let logoScales = {
  small: 0.5,
  medium: 0.75,
  large: 1,
}

export const LogoVertical = memo(
  ({ size, ...rest }: ViewProps & { size?: 'small' | 'medium' | 'large' }) => {
    const theme = useTheme()
    const screenSize = useScreenSize()
    const parallax = useParallax()
    const nav = useNavigation()
    const scale = logoScales[size || screenSize]

    return (
      <View
        position="relative"
        zIndex={100000}
        cursor="pointer"
        alignItems="center"
        justifyContent="center"
        transform={{ scale }}
        padding={[0, 20]}
        onClick={async e => {
          e.preventDefault()
          if ((await nav.getRoute()).url.pathname === '/') {
            parallax && parallax.scrollTo(0)
          } else {
            nav.navigate('/')
          }
        }}
        {...rest}
      >
        <Image src={mark} />
        <Space size="lg" />
        <SVG cleanup fill={theme.color} width={102 * 0.8} height={23 * 0.8} svg={orbit} />
      </View>
    )
  },
)

const Image = gloss(View)

Image.defaultProps = {
  tagName: 'img',
}
