import * as React from 'react'
import { VerticalSpace } from '.'
import { Divider } from './Divider'
import { SubTitle } from './SubTitle'

export function SubSection({
  title,
  children,
}: {
  title: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <>
      <VerticalSpace />
      <SubTitle>{title}</SubTitle>
      <Divider padding={[5, 10]} />
      <VerticalSpace />
      {children}
    </>
  )
}
