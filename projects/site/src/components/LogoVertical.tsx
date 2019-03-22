import { Space, View } from '@o/ui'
import React from 'react'
import orbit from '../../public/orbit.svg'
import mark from '../../public/orbitmark.svg'

export function LogoVertical() {
  return (
    <View alignItems="center" justifyContent="center">
      <img src={mark} />
      <Space />
      <Space />
      <img src={orbit} />
    </View>
  )
}
