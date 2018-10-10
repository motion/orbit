import * as React from 'react'
import { SubTitle } from '../../../../views'
import { Row, Col } from '@mcro/ui'
import { RoundButtonSmall } from '../../../../views/RoundButtonSmall'

export const OrbitSection = ({ title, children, ...props }) => {
  return (
    <>
      {!!title && (
        <Row {...props}>
          <SubTitle margin={0} padding={[2, 4, 0]} fontWeight={500} fontSize={14}>
            {title}
          </SubTitle>
          <Col flex={1} />
          <RoundButtonSmall
            icon="remove"
            iconProps={{ size: 9 }}
            opacity={0}
            hoverStyle={{ opacity: 1 }}
          />
        </Row>
      )}
      {children}
    </>
  )
}
