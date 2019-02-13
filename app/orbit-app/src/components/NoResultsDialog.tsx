import { Button, View } from '@mcro/ui'
import * as React from 'react'
import { useStores } from '../hooks/useStores'
import { PaneManagerStore } from '../stores/PaneManagerStore'
import * as Views from '../views'
import { VerticalSpace } from '../views'

type Props = {
  paneManagerStore?: PaneManagerStore
  subName: string
}

export default function NoResultsDialog(props: Props) {
  const { paneManagerStore } = useStores()
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
}
