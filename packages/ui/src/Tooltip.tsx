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
      padding={[1, 5]}
      borderRadius={4}
      distance={10}
      arrowSize={8}
      fontSize={13}
      delay={400}
      popoverProps={POPOVER_PROPS}
      ignoreSegment
      {...props}
    />
  </Theme>
)
