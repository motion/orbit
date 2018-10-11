import * as React from 'react'
import { View } from '@mcro/ui'

export const OrbitOrb = ({ bg, color }) => (
  <View
    background={bg}
    borderRadius={100}
    width={32}
    height={32}
    alignItems="center"
    justifyContent="center"
  >
    <View border={[2, color]} borderRadius={100} width={28} height={28} />
  </View>
)
