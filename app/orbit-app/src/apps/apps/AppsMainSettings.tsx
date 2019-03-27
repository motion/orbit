import { AppProps, AppView } from '@o/kit'
import * as React from 'react'

export function AppsMainSetup(props: AppProps) {
  if (props.viewType === 'setup') {
    return <AppView identifier={props.identifier} viewType="setup" {...props} />
  }

  if (props.viewType === 'settings') {
    return <AppView identifier={props.identifier} viewType="settings" {...props} />
  }
}
