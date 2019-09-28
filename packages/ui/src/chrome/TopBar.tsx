import React from 'react'

import { BorderBottom } from '../Border'
import { SurfacePassProps } from '../SizedSurfacePropsContext'
import { Stack } from '../View/Stack'

export type TopBarProps = {
  before?: React.ReactNode
  after?: React.ReactNode
  bordered?: boolean
}

export function TopBar({ bordered, before, after }: TopBarProps) {
  return (
    <Stack direction="horizontal" position="relative" alignItems="center" justifyContent="center">
      {bordered && <BorderBottom opacity={0.33} />}
      <Stack direction="horizontal" flex={1}>
        <SurfacePassProps chromeless sizeRadius={0} height={33}>
          {before}
        </SurfacePassProps>
      </Stack>
      {!!after && (
        <Stack direction="horizontal" padding={[0, 6, 0, 12]}>
          <SurfacePassProps chromeless alpha={0.3} alphaHover={1} height={33} iconSize={14}>
            {after}
          </SurfacePassProps>
        </Stack>
      )}
    </Stack>
  )
}
