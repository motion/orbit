import { AppViewProps } from '@o/models'
import { CenteredText } from '@o/ui'
import React, { memo } from 'react'

import { AppView } from './AppView'

export const AppMainView = memo((props: AppViewProps) => {
  if (!props.identifier) {
    return <CenteredText>No identifier passed to AppMainView</CenteredText>
  }
  return (
    <AppView
      key={JSON.stringify(props)}
      id={props.id}
      identifier={props.identifier}
      viewType={props.viewType || 'main'}
      appProps={props}
    />
  )
})
