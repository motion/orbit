import { Col, gloss } from '@o/gloss'
import React from 'react'
import { BorderBottom, BorderLeft, BorderRight, BorderTop } from './Border'
import { SurfacePassProps } from './Surface'
import { View, ViewProps } from './View/View'

export const Spacer = gloss(Col, {
  flexGrow: 1,
})

export type ToolbarProps = ViewProps & {
  attach?: 'bottom' | 'left' | 'right' | 'top'
}

const borderElement = {
  top: <BorderBottom opacity={0.5} />,
  bottom: <BorderTop opacity={0.5} />,
  left: <BorderRight opacity={0.5} />,
  right: <BorderLeft opacity={0.5} />,
}

const opposite = {
  bottom: 'top',
  top: 'bottom',
  left: 'right',
  right: 'left',
}

export function Toolbar({ children, elevation = 3, attach = 'bottom', ...props }: ToolbarProps) {
  return (
    <ToolbarChrome elevation={elevation} {...props}>
      {borderElement[attach]}
      <SurfacePassProps size={1.2} iconAfter tooltipProps={{ towards: opposite[attach] as any }}>
        {children}
      </SurfacePassProps>
    </ToolbarChrome>
  )
}

const ToolbarChrome = gloss<ToolbarProps>(View, {
  flexFlow: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 20,
  width: '100%',
  position: 'relative',
}).theme((props, theme) => ({
  background: props.background || theme.backgroundStronger,
}))
