import { AppViewProps } from '@o/orbit-types'
import { Col, PassProps, SubTitle, Title } from '@o/ui'
import React from 'react'

import { Icon } from '../views/Icon'

export function Message({
  title,
  icon,
  subTitle,
  subType,
  children,
}: AppViewProps & { children?: React.ReactNode }) {
  return (
    <Col flex={1} pad="lg" space="lg" alignItems="center" justifyContent="center">
      <Col space="sm" alignItems="center" justifyContent="center">
        {!!title && <Title size={title.length > 40 ? 1.4 : 2.2}>{title}</Title>}
        {!!subTitle && <SubTitle>{subTitle}</SubTitle>}
        {!!subType && <SubTitle>{subType}</SubTitle>}
      </Col>
      <>
        <PassProps size={128} opacity={0.5}>
          {typeof icon === 'string' ? <Icon name={icon} /> : icon || null}
        </PassProps>
      </>
      {children}
    </Col>
  )
}
