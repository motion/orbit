import { useStores } from '@o/kit'
import { Button, SubTitle, VerticalSpace, View } from '@o/ui'
import * as React from 'react'

type Props = {
  subName: string
}

export default function NoResultsDialog(props: Props) {
  const { paneManagerStore } = useStores()
  return (
    <>
      <View alignItems="center" justifyContent="center" padding={25}>
        <SubTitle>You're searching {props.subName} & no results found.</SubTitle>
        <VerticalSpace />
        <Button onClick={() => paneManagerStore.setActivePaneByType('search')} size={1.2}>
          Search Orbit Instead
        </Button>
      </View>
    </>
  )
}
