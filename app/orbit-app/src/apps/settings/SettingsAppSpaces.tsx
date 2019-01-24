import { AppType } from '@mcro/models'
import { Absolute, Theme } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { RoundButton } from '../../views'
import { AppProps } from '../AppProps'

export default observer(function SettingsAppSpaces(_: AppProps<AppType.settings>) {
  const stores = useStoresSafe()
  const { activeSpace, inactiveSpaces } = stores.spaceStore

  return (
    <>
      hello spaces
      {JSON.stringify(activeSpace)}
      {JSON.stringify(inactiveSpaces)}
      <Absolute bottom={10} right={10}>
        <Theme name="selected">
          <RoundButton
            elevation={1}
            size={1.8}
            sizeIcon={0.6}
            circular
            icon="add"
            tooltip="Create new app"
          />
        </Theme>
      </Absolute>
    </>
  )
})
