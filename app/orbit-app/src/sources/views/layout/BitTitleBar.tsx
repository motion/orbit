import * as React from 'react'
import { Row } from '@mcro/ui'
import { BitTitleActions } from './BitTitleActions'
import { AppSimpleTitleBar } from './AppSimpleTitleBar'
import { TitleBarSpace } from './TitleBarSpace'
import { NormalizedItem } from '../../../helpers/normalizeItem'
import { AppPageStore } from '../../../pages/AppPage/AppPageStore'
import { attach } from '@mcro/black'

@attach('appPageStore')
export class BitTitleBar extends React.Component<{
  searchBar: any
  normalizedItem: NormalizedItem
  appPageStore?: AppPageStore
}> {
  render() {
    const { appPageStore, searchBar, normalizedItem } = this.props
    return (
      <>
        <AppSimpleTitleBar onDragStart={appPageStore.onDragStart} title={normalizedItem.title} />
        <Row alignItems="center" height={38} margin={[25, 15, 0]}>
          {searchBar}
          <TitleBarSpace />
          <BitTitleActions normalizedItem={normalizedItem} />
        </Row>
      </>
    )
  }
}
