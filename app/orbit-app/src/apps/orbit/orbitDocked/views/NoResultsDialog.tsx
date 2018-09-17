import * as React from 'react'
import { VerticalSpace } from '../../../../views'
import { Button, View } from '@mcro/ui'
import * as Views from '../../../../views'
import { PaneManagerStore } from '../../PaneManagerStore'
import { view } from '@mcro/black'

type Props = {
  paneManagerStore?: PaneManagerStore
}

@view.attach('paneManagerStore')
export class NoResultsDialog extends React.Component<Props> {
  render() {
    return (
      <>
        <View alignItems="center" justifyContent="center" padding={25}>
          <Views.SubTitle>You're searching the app store & no results found.</Views.SubTitle>
          <VerticalSpace />
          <Button onClick={() => this.props.paneManagerStore.setActivePane('home')} size={1.2}>
            Search Orbit Instead
          </Button>
        </View>
      </>
    )
  }
}
