import { PassProps, Space, SubTitle, Title, View } from '@o/ui'
import React from 'react'
import { AppProps } from '../types/AppProps'
import { Icon } from '../views/Icon'

export function Message({ title, icon, subTitle, subType }: AppProps) {
  return (
    <View flex={1} alignItems="center" justifyContent="center" padding={20}>
      {!!title && <Title size={title.length > 40 ? 1.4 : 2.2}>{title}</Title>}
      {!!subTitle && (
        <>
          <SubTitle>{subTitle}</SubTitle>
        </>
      )}
      {!!subType && (
        <>
          <SubTitle>{subType}</SubTitle>
        </>
      )}
      <Space small />
      <PassProps size={88}>
        {typeof icon === 'string' ? <Icon name={icon} /> : icon || null}
      </PassProps>
    </View>
  )
}
