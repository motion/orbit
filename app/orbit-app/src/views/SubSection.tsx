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
      <VerticalSpace small />
      <SubTitle size={1.3}>{title}</SubTitle>
      <Divider padding={5} />
      <VerticalSpace small />
      {children}
    </>
  )
}
