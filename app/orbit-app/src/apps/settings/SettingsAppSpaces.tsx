import { AppType } from '@mcro/models'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { AppProps } from '../AppProps'

// const createNewSpace = () => {
//   AppActions.togglePeekApp({
//     appConfig: {
//       type: 'newSpace',
//       title: 'New Space',
//       icon: 'orbit',
//     },
//     // TODO
//     target: [0, 0],
//   })
// }

export default observer(function SettingsAppSpaces(props: AppProps<AppType.settings>) {
  const stores = useStoresSafe()
  const { activeSpace, inactiveSpaces } = stores.spaceStore

  return (
    <>
      hello spaces
      {JSON.stringify(activeSpace)}
      {JSON.stringify(inactiveSpaces)}
    </>
  )
})
