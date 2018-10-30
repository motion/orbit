import * as React from 'react'
import { VerticalSpace } from '../views'
import { Button, View } from '@mcro/ui'
import * as Views from '../views'
import { attach } from '@mcro/black'
import { PaneManagerStore } from '../stores/PaneManagerStore'

type Props = {
  paneManagerStore?: PaneManagerStore
  subName: string
}

@attach('paneManagerStore')
export class NoResultsDialog extends React.Component<Props> {
  render() {
    return (
      <>
        <View alignItems="center" justifyContent="center" padding={25}>
          <Views.SubTitle>You're searching {this.props.subName} & no results found.</Views.SubTitle>
          <VerticalSpace />
          <Button onClick={() => this.props.paneManagerStore.setActivePane('home')} size={1.2}>
            Search Orbit Instead
          </Button>
        </View>
      </>
    )
  }
}
