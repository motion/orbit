import { Col, ColProps, getSizeRelative, SizeName } from '@o/ui'
import React from 'react'

import { useScreenSize } from '../../hooks/useScreenSize'

type SpacedPageProps = Omit<ColProps, 'space'> & {
  header?: React.ReactNode
  space?: SizeName
}

export const SpacedPageContent = ({
  header = null,
  children,
  space = 'lg',
  nodeRef,
  ...props
}: SpacedPageProps) => {
  const downSpace = getSizeRelative(space, -1)
  const down2Space = getSizeRelative(space, -2)
  return (
    <Col
      width="100%"
      sm-margin={0}
      margin={['auto', 0]}
      space={space}
      sm-space={downSpace}
      {...props}
    >
      <Col className="intersect-ref" space={space} sm-space={downSpace} nodeRef={nodeRef}>
        <Col space={downSpace} sm-space={down2Space} alignItems="center">
          {header}
        </Col>
        {children}
      </Col>
    </Col>
  )
}

export const useScreenVal = (small: any, medium: any, large: any) => {
  const screen = useScreenSize()
  return screen === 'small' ? small : screen === 'medium' ? medium : large
}
