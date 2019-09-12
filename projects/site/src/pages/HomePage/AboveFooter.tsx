import { Space, useTheme, View } from '@o/ui'
import React from 'react'

import { LogoVertical } from '../../views/LogoVertical'
import { SignupForm } from './SignupForm'

export const AboveFooter = (props: { hideJoin?: boolean }) => {
  const theme = useTheme()
  return (
    <>
      {!props.hideJoin && (
        <>
          <SignupForm width="80%" background={theme.backgroundStrong} borderRadius={20} />
          <View sm-flex="1" flex="3" lg-flex="4" />
        </>
      )}
      <Space size={75} />
      <LogoVertical />
      <Space size={75} />
    </>
  )
}
