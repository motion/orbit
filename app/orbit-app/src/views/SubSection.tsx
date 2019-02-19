import { VerticalSpace, View } from '@mcro/ui'
import * as React from 'react'
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
    <View paddingBottom={10}>
      <VerticalSpace small />
      <SubTitle size={1.3} paddingBottom={5}>
        {title}
      </SubTitle>
      <Divider padding={5} />
      <VerticalSpace />
      {children}
    </View>
  )
}
