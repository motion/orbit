import { AppViewProps } from '@o/models'
import { Icon, PassProps, Stack, StackProps, SubTitle, Title } from '@o/ui'
import React from 'react'

export type TemplateMessageProps = Omit<StackProps & AppViewProps, 'icon'> & {
  children?: React.ReactNode
  icon?: React.ReactNode
}

export function Message({
  title,
  icon,
  subTitle,
  subType,
  children,
  ...props
}: TemplateMessageProps) {
  return (
    <Stack flex={1} padding="lg" space="xl" alignItems="center" justifyContent="center" {...props}>
      <Stack space alignItems="center" justifyContent="center" textAlign="center">
        {!!title && <Title size={title.length > 40 ? 1 : 1.2}>{title}</Title>}
        {!!subTitle && <SubTitle>{subTitle}</SubTitle>}
        {!!subType && <SubTitle>{subType}</SubTitle>}
      </Stack>
      <>
        <PassProps size={128} opacity={0.5}>
          {typeof icon === 'string' ? <Icon name={icon} /> : icon || null}
        </PassProps>
      </>
      {children}
    </Stack>
  )
}
