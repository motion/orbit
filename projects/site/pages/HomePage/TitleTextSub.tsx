import { TextProps, View } from '@o/ui'
import React, { forwardRef } from 'react'

import { fontProps } from '../../constants'
import { TitleText } from '../../views/TitleText'

export const TitleTextSub = forwardRef<any, TextProps>((props, ref) => (
  <View nodeRef={ref} maxWidth={800} minWidth={300} textAlign="center">
    <TitleText
      size="xxs"
      sizeLineHeight={1.35}
      fontWeight={400}
      alpha={0.65}
      {...fontProps.BodyFont}
      {...props}
    />
  </View>
))
