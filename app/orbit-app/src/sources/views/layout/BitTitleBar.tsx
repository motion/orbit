import * as React from 'react'
import { Row } from '@mcro/ui'
import { BitTitleActions } from './BitTitleActions'
import { TitleBarSpace } from './TitleBarSpace'
import { NormalItem } from '../../../helpers/normalizeItem'

export class BitTitleBar extends React.Component<{
  searchBar: any
  normalizedItem: NormalItem
}> {
  render() {
    const { searchBar, normalizedItem } = this.props
    return (
      <>
        <Row alignItems="center" height={38} margin={[8, 15]}>
          {searchBar}
          <TitleBarSpace />
          <BitTitleActions normalizedItem={normalizedItem} />
        </Row>
      </>
    )
  }
}
