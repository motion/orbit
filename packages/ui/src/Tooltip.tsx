import * as React from 'react'
import { Popover, PopoverProps } from './Popover'

const POPOVER_PROPS = { style: { fontSize: 12 } }

type TooltipProps = Partial<PopoverProps> & {
  themeName?: string
  label: React.ReactNode | string
}

const defaultOnClick = e => {
  e.stopPropagation()
  console.log('no click on tooltip')
}

export const Tooltip = React.forwardRef(
  (
    {
      themeName = 'tooltip',
      onClick = defaultOnClick,
      disabled = false,
      label,
      children,
      ...props
    }: TooltipProps,
    ref,
  ) => {
    if (disabled || !label) {
      return children as any
    }
    return (
      <Popover
        background
        openOnHover
        noHoverOnChildren
        animation="bounce 150ms"
        padding={[1, 5]}
        borderRadius={4}
        distance={10}
        arrowSize={8}
        fontSize={12}
        delay={450}
        popoverProps={POPOVER_PROPS}
        ignoreSegment
        elevation={1}
        onClick={onClick}
        theme={themeName}
        target={children}
        ref={ref as any}
        {...props}
      >
        {label}
      </Popover>
    )
  },
)
