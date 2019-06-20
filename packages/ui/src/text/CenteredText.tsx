import React from 'react'
import { View } from '../View/View'
import { Center } from '../Center'
import { SubTitle, SubTitleProps } from './SubTitle'

export const CenteredText = (props: SubTitleProps) => (
  <View minHeight={100} flex={1}>
    <Center>
      <SubTitle {...props} />
    </Center>
  </View>
)
