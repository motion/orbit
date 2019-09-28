import { Flex, FlexProps, useTheme } from 'gloss'
import React from 'react'

import { BorderRight, BorderTop } from './Border'

export const SeparatorVertical = (props: FlexProps) => {
  const theme = useTheme()
  return (
    <Flex width={1} height="100%" position="relative" {...props}>
      <BorderRight borderColor={theme.backgroundStrongest} />
    </Flex>
  )
}

export const SeparatorHorizontal = (props: FlexProps) => {
  const theme = useTheme()
  return (
    <Flex flexDirection="row" height={1} width="100%" position="relative" {...props}>
      <BorderTop borderColor={theme.backgroundStrongest} />
    </Flex>
  )
}
