import { Space, View } from '@o/ui'
import React from 'react'
import orbit from '../../public/images/orbit-logo.svg'
import mark from '../../public/images/orbitmark.svg'

export function LogoVertical() {
  return (
    <View alignItems="center" justifyContent="center">
      <img src={mark} />
      <Space />
      <Space />
      <img src={orbit} style={{ shapeRendering: 'crispEdges' }} />
    </View>
  )
}
