import { Button, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import * as React from 'react'
import { useStoresSafe } from '../hooks/useStoresSafe'
import { PaneManagerStore } from '../stores/PaneManagerStore'
import * as Views from '../views'
import { VerticalSpace } from '../views'

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
        <Button onClick={() => paneManagerStore.setActivePaneByType('search')} size={1.2}>
          Search Orbit Instead
        </Button>
      </View>
    </>
  )
})
