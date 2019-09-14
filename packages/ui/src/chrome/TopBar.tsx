import { Row } from 'gloss'
import React from 'react'
import { BorderBottom } from '../Border'
import { SurfacePassProps } from "../SizedSurfacePropsContext";

export type TopBarProps = {
  before?: React.ReactNode
  after?: React.ReactNode
  bordered?: boolean
}

export function TopBar({ bordered, before, after }: TopBarProps) {
  return (
    <Row position="relative" alignItems="center" justifyContent="center">
      {bordered && <BorderBottom opacity={0.33} />}

      <Row flex={1}>
        <SurfacePassProps chromeless sizeRadius={0} height={33}>
          {before}
        </SurfacePassProps>
      </Row>

      {!!after && (
        <Row padding={[0, 6, 0, 12]}>
          <SurfacePassProps chromeless alpha={0.3} alphaHover={1} height={33} iconSize={14}>
            {after}
          </SurfacePassProps>
        </Row>
      )}
    </Row>
  )
}
