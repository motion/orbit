import { AppType } from '@mcro/models'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { AppProps } from '../AppProps'

export default observer(function SettingsAppAccount(props: AppProps<AppType.settings>) {
  return <>hi {JSON.stringify(props.appConfig)}</>
})
