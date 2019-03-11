import { Divider, SubTitle, VerticalSpace, View } from '@o/ui'
import * as React from 'react'

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
