import * as React from 'react'
import { Row } from '@mcro/ui'
import { BitTitleActions } from './BitTitleActions'
import { AppSimpleTitleBar } from './AppSimpleTitleBar'
import { TitleBarSpace } from './TitleBarSpace'
import { NormalizedItem } from '../../../helpers/normalizeItem'

export class BitTitleBar extends React.Component<{
  searchBar: any
  normalizedItem: NormalizedItem
}> {
  render() {
    const { searchBar, normalizedItem } = this.props
    return (
      <>
        <AppSimpleTitleBar normalizedItem={normalizedItem} />
        <Row alignItems="center" height={38} margin={[25, 15, 0]}>
          {searchBar}
          <TitleBarSpace />
          <BitTitleActions normalizedItem={normalizedItem} />
        </Row>
      </>
    )
  }
}
