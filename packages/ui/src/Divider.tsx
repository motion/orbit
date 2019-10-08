import { gloss } from 'gloss'
import * as React from 'react'

import { Stack, StackProps } from './View/Stack'
import { View } from './View/View'

export const BarInner = gloss(View, {
  flex: 1,
  borderRadius: 100,
}).theme(props => ({
  background: props.borderColorLighter,
}))

export type DividerProps = Partial<StackProps>

export function Divider({ background = null, height = 1, ...props }: DividerProps) {
  return (
    <Stack direction="horizontal" pointerEvents="inherit" zIndex={10} {...props}>
      <BarInner background={background} height={height} />
    </Stack>
  )
}
