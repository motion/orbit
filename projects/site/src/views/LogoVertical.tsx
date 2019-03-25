import { Space, View } from '@o/ui'
import React from 'react'
import orbit from '../../public/images/orbit-logo.svg'
import mark from '../../public/images/orbitmark.svg'
import { useScreenSize } from '../hooks/useScreenSize'

let scale = {
  small: 0.5,
  medium: 0.75,
  large: 1,
}

export function LogoVertical() {
  const size = useScreenSize()

  return (
    <View
      alignItems="center"
      justifyContent="center"
      transform={{ scale: scale[size] }}
      padding={[0, 20]}
    >
      <img src={mark} />
      <Space />
      <Space />
      <img width={103} height={23} src={orbit} style={{ shapeRendering: 'crispEdges' }} />
    </View>
  )
}
