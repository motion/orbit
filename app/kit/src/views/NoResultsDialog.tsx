import { Button, Space, SubTitle, View } from '@o/ui'
import * as React from 'react'
import { useStores } from '../'

type Props = {
  subName: string
}

export function NoResultsDialog(props: Props) {
  const { paneManagerStore } = useStores()
  return (
    <>
      <View alignItems="center" justifyContent="center" padding={25} flex={1}>
        <SubTitle>Nothing loaded in {props.subName}.</SubTitle>
        <Space />
        <Button onClick={() => paneManagerStore.setActivePaneByType('search')} size={1.2}>
          Search Everything
        </Button>
      </View>
    </>
  )
}
