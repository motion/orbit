import { gloss } from 'gloss'
import React from 'react'

import { BorderBottom, BorderLeft, BorderRight, BorderTop } from './Border'
import { Sizes } from './Space'
import { SpaceGroup } from './SpaceGroup'
import { SurfacePassProps } from './Surface'
import { Omit } from './types'
import { Row, RowProps } from './View/Row'

export type ToolbarProps = Omit<RowProps, 'size'> & {
  attach?: 'bottom' | 'left' | 'right' | 'top'
  size?: Sizes
}

const borderElement = {
  top: <BorderBottom />,
  bottom: <BorderTop />,
  left: <BorderRight />,
  right: <BorderLeft />,
}

const opposite = {
  bottom: 'top',
  top: 'bottom',
  left: 'right',
  right: 'left',
}

export function Toolbar({
  children,
  size = 'sm',
  // todo can make elevation scale with size...
  elevation,
  attach = 'bottom',
  border,
  ...props
}: ToolbarProps) {
  return (
    <SurfacePassProps
      borderWidth={0}
      sizeRadius={1.2}
      iconAfter
      tooltipProps={{ towards: opposite[attach] as any }}
      glint={false}
      borderPosition="outside"
    >
      <ToolbarChrome elevation={elevation} pad={size} {...props}>
        {border !== false && borderElement[attach]}
        <SpaceGroup space={size}>{children}</SpaceGroup>
      </ToolbarChrome>
    </SurfacePassProps>
  )
}

const ToolbarChrome = gloss<ToolbarProps>(Row, {
  flexFlow: 'row',
  alignItems: 'center',
  width: '100%',
  position: 'relative',
}).theme((props, theme) => ({
  background: props.background || theme.backgroundStrong,
}))
