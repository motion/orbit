import { gloss, TextProps, View } from '@o/ui'
import React from 'react'

import { fontProps } from '../../constants'
import { TitleText } from '../../views/TitleText'

export const TitleTextSub = gloss((props: TextProps) => (
  <View maxWidth={800} minWidth={300} textAlign="center">
    <TitleText
      size="sm"
      sizeLineHeight={1.35}
      fontWeight={300}
      alpha={0.65}
      {...fontProps.Nunito}
      {...props}
    />
  </View>
))
