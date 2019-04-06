import { gloss } from '@o/gloss'
import React from 'react'
import { BorderBottom, BorderLeft, BorderRight, BorderTop } from './Border'
import { Sizes } from './Space'
import { SurfacePassProps } from './Surface'
import { Row, RowProps } from './View/Row'
import { SpaceGroup } from './View/SpaceGroup'

export type ToolbarProps = RowProps & {
  attach?: 'bottom' | 'left' | 'right' | 'top'
  size?: Sizes
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

export function Toolbar({
  children,
  size = 'sm',
  // todo can make elevation scale with size...
  elevation,
  attach = 'bottom',
  ...props
}: ToolbarProps) {
  return (
    <SurfacePassProps
      borderWidth={0}
      size={size}
      iconAfter
      tooltipProps={{ towards: opposite[attach] as any }}
    >
      <ToolbarChrome elevation={elevation} {...props}>
        {borderElement[attach]}
        <SpaceGroup space={size}>{children}</SpaceGroup>
      </ToolbarChrome>
    </SurfacePassProps>
  )
}

const ToolbarChrome = gloss<ToolbarProps>(Row, {
  flexFlow: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  position: 'relative',
}).theme((props, theme) => ({
  background: props.background || theme.backgroundStronger,
}))

ToolbarChrome.defaultProps = {
  pad: true,
}
