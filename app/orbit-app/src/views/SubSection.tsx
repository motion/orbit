import { Divider, SubTitle, View } from '@o/ui'
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
      <SubTitle size={1.3} paddingBottom={5}>
        {title}
      </SubTitle>
      <Divider padding={[0, 0, 10]} />
      {children}
    </View>
  )
}
