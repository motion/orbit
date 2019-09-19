import { Space, useTheme } from '@o/ui'
import React from 'react'

import { LogoVertical } from '../../views/LogoVertical'
import { SignupForm } from './SignupForm'

export const AboveFooter = (props: { hideJoin?: boolean }) => {
  const theme = useTheme()
  return (
    <>
      <LogoVertical />
      {!props.hideJoin && (
        <>
          <Space size={75} />
          <SignupForm width="80%" background={theme.backgroundStrong} borderRadius={20} />
        </>
      )}
    </>
  )
}
