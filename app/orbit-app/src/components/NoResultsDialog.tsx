import * as React from 'react'
import { VerticalSpace } from '../views'
import { Button, View } from '@mcro/ui'
import * as Views from '../views'
import { PaneManagerStore } from '../stores/PaneManagerStore'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { observer } from 'mobx-react-lite'

type Props = {
  paneManagerStore?: PaneManagerStore
  subName: string
}

export default observer(function NoResultsDialog(props: Props) {
  const { paneManagerStore } = useStoresSafe()
  return (
    <>
      <View alignItems="center" justifyContent="center" padding={25}>
        <Views.SubTitle>You're searching {props.subName} & no results found.</Views.SubTitle>
        <VerticalSpace />
        <Button onClick={() => paneManagerStore.setActivePane('home')} size={1.2}>
          Search Orbit Instead
        </Button>
      </View>
    </>
  )
})
