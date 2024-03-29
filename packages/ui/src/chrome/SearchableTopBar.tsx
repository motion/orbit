import React from 'react'

import { Input, InputProps } from '../forms/Input'
import { TopBar } from './TopBar'

export function SearchableTopBar({ buttons, ...props }: InputProps & { buttons: React.ReactNode }) {
  return (
    <TopBar
      bordered
      before={<Input chromeless padding={[0, 12]} flex={1} {...props} />}
      after={buttons}
    />
  )
}
