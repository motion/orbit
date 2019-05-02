import { gloss, TextProps, View } from '@o/ui'
import React from 'react'

import { TitleText } from '../../views/TitleText'

export const TitleTextSub = gloss((props: TextProps) => (
  <View maxWidth={800} minWidth={300} textAlign="center">
    <TitleText size="md" sizeLineHeight={1.3} fontWeight={300} alpha={0.72} {...props} />
  </View>
))
