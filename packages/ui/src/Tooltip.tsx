import * as React from 'react'
import { Theme } from '@mcro/gloss'
import { Popover, PopoverProps } from './Popover'

const POPOVER_PROPS = { style: { fontSize: 12 } }

type TooltipProps = Partial<PopoverProps> & {
  themeName?: string
}

export const Tooltip = ({ themeName, ...props }: TooltipProps) => (
  <Theme name="dark">
    <Popover
      background
      openOnHover
      closeOnClick
      noHoverOnChildren
      animation="bounce 150ms"
      padding={[2, 7]}
      borderRadius={5}
      distance={12}
      arrowSize={10}
      delay={400}
      popoverProps={POPOVER_PROPS}
      ignoreSegment
      {...props}
    />
  </Theme>
)
