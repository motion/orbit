import { gloss } from 'gloss'
import * as React from 'react'

import { Stack, StackProps } from './View/Stack'
import { View } from './View/View'

export const BarInner = gloss(View, {
  flex: 1,
  borderRadius: 100,
}).theme((_, theme) => ({
  background: theme.borderColor.setAlpha(a => a * 0.35),
}))

export type DividerProps = Partial<StackProps>

export function Divider({ background = null, height = 1, ...props }: DividerProps) {
  return (
    <Stack direction="horizontal" pointerEvents="inherit" zIndex={10} {...props}>
      <BarInner background={background} height={height} />
    </Stack>
  )
}
