import orbit from '!raw-loader!../../public/images/logomark-solid.svg'
import { gloss } from '@o/gloss'
import { SVG } from '@o/kit'
import { View } from '@o/ui'
import React from 'react'
import { useNavigation } from 'react-navigation-hooks'

export function LogoHorizontal() {
  const { navigate } = useNavigation()
  const scaleDown = 0.3333

  return (
    <View
      cursor="pointer"
      alignItems="center"
      justifyContent="center"
      flex={1}
      padding={[0, 20]}
      transform={{
        y: -1,
        x: -4,
      }}
      onClick={() => {
        navigate('Home')
      }}
    >
      <SVG width={`${345 * scaleDown}px`} height={`${114 * scaleDown}px`} svg={orbit} />
    </View>
  )
}

const Image = gloss(View)

Image.defaultProps = {
  tagName: 'img',
}