import { Stack, StackProps, useTheme } from 'gloss'
import React from 'react'

import { BorderRight, BorderTop } from './Border'

export const SeparatorVertical = (props: StackProps) => {
  const theme = useTheme()
  return (
    <Stack width={1} height="100%" position="relative" {...props}>
      <BorderRight borderColor={theme.backgroundStrongest} />
    </Stack>
  )
}

export const SeparatorHorizontal = (props: StackProps) => {
  const theme = useTheme()
  return (
    <Stack direction="horizontal" height={1} width="100%" position="relative" {...props}>
      <BorderTop borderColor={theme.backgroundStrongest} />
    </Stack>
  )
}
