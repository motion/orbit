import { AppViewProps } from '@o/models'
import { Col, Icon, PassProps, SubTitle, Title } from '@o/ui'
import React from 'react'

export function Message({
  title,
  icon,
  subTitle,
  subType,
  children,
}: AppViewProps & { children?: React.ReactNode }) {
  return (
    <Col flex={1} padding="lg" space="xl" alignItems="center" justifyContent="center">
      <Col space alignItems="center" justifyContent="center" textAlign="center">
        {!!title && <Title size={title.length > 40 ? 1 : 1.2}>{title}</Title>}
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
