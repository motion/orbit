import { Row } from '@o/gloss'
import React from 'react'
import { BorderBottom } from '../Border'
import { SurfacePassProps } from '../Surface'

export type TopBarProps = {
  before?: React.ReactNode
  after?: React.ReactNode
}

export function TopBar({ before, after }: TopBarProps) {
  return (
    <Row position="relative">
      <SurfacePassProps chromeless sizeRadius={0} height={33}>
        {before}
      </SurfacePassProps>

      {!!after && (
        <Row padding={[0, 6, 0, 12]}>
          <SurfacePassProps chromeless alpha={0.3} alphaHover={1} height={33}>
            {after}
          </SurfacePassProps>
        </Row>
      )}

      <BorderBottom opacity={0.25} />
    </Row>
  )
}
