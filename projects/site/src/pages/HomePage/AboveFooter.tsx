import { Space, useTheme, View } from '@o/ui'
import React from 'react'

import { LogoVertical } from '../../views/LogoVertical'
import { SignupForm } from './SignupForm'
import { useScreenVal } from './SpacedPageContent'

export const AboveFooter = () => {
  const theme = useTheme()
  return (
    <>
      <SignupForm width="80%" background={theme.backgroundStrong} borderRadius={20} />
      <View flex={useScreenVal(1, 3, 4)} />
      <Space size={75} />
      <LogoVertical />
      <Space size={75} />
    </>
  )
}
