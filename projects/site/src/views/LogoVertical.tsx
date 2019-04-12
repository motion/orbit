import orbit from '!raw-loader!../../public/images/orbit-logo.svg'
import { gloss, useTheme } from '@o/gloss'
import { SVG } from '@o/kit'
import { Space, View } from '@o/ui'
import React from 'react'
import { useNavigation } from 'react-navigation-hooks'
import mark from '../../public/images/orbit-mark.svg'
import { useScreenSize } from '../hooks/useScreenSize'

let scale = {
  small: 0.5,
  medium: 0.75,
  large: 1,
}

export function LogoVertical(props: { size?: 'small' | 'medium' | 'large' }) {
  const theme = useTheme()
  const screenSize = useScreenSize()
  const size = props.size || screenSize
  const { navigate } = useNavigation()

  return (
    <View
      cursor="pointer"
      alignItems="center"
      justifyContent="center"
      transform={{ scale: scale[size] }}
      padding={[0, 20]}
      onClick={() => {
        navigate('Home')
      }}
    >
      <Image src={mark} />
      <Space />
      <SVG cleanup fill={theme.color} width={102} height={23} svg={orbit} />
    </View>
  )
}

const Image = gloss(View)

Image.defaultProps = {
  tagName: 'img',
}
