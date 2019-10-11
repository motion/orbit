import { gloss } from 'gloss'
import React from 'react'

import { BorderBottom, BorderLeft, BorderRight, BorderTop } from './Border'
import { Size } from './Space'
import { SurfacePassProps } from './SurfacePropsContext'
import { Stack, StackProps } from './View/Stack'

export type ToolbarProps = Omit<StackProps, 'size'> & {
  attach?: 'bottom' | 'left' | 'right' | 'top'
  size?: Size
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
      sizeRadius={1.25}
      iconAfter
      tooltipProps={{ towards: opposite[attach] as any }}
      glint={false}
      borderPosition="outside"
    >
      <ToolbarRow elevation={elevation} padding={size} hoverStyle={null} {...props}>
        {!!border && borderElement[attach]}
        <Stack direction="horizontal" flex={1} space={size}>
          {children}
        </Stack>
      </ToolbarRow>
    </SurfacePassProps>
  )
}

const ToolbarRow = gloss<ToolbarProps>(Stack, {
  flexDirection: 'row',
  alignItems: 'center',
  width: '100%',
  position: 'relative',
}).theme(props => ({
  background: props.backgroundStrong,
}))
