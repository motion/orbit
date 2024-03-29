import React from 'react'

import { Popover, PopoverProps } from './Popover'
import { Scale, useScale } from './Scale'

const POPOVER_PROPS = { style: { fontSize: 12 } }

type TooltipProps = Partial<PopoverProps> & {
  popoverTheme?: string
  label: React.ReactNode | string
}

const defaultOnClick = e => {
  e.stopPropagation()
  console.log('no click on tooltip')
}

export const Tooltip = ({
  popoverTheme = 'tooltip',
  onClick = defaultOnClick,
  disabled = false,
  label,
  children,
  ...props
}) => {
  const scale = useScale()
  if (disabled || !label) {
    return children as any
  }
  return (
    <Scale size={1}>
      <Popover
        background
        openOnHover
        noHoverOnChildren
        // @ts-ignore "excessively deep"
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
        popoverTheme={popoverTheme}
        target={
          scale !== 1 && React.isValidElement(children) ? (
            <Scale size={scale}>{children}</Scale>
          ) : (
            children
          )
        }
        {...props}
      >
        {label}
      </Popover>
    </Scale>
  )
}
