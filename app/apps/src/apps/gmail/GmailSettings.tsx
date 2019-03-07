import { AppProps, AppSubView } from '@o/kit'
import * as React from 'react'

export function GmailSettings(_: AppProps) {
  return (
    <AppSubView
      viewType="main"
      appConfig={{ identifier: 'message', title: 'Gmail sync active', icon: 'gmail' }}
    />
  )
}
