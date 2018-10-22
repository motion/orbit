import * as React from 'react'
import { Row } from '@mcro/ui'
import { OrbitIntegrationMainProps } from '../../types'
import { BitTitleActions } from './BitTitleActions'
import { AppSimpleTitleBar } from './AppSimpleTitleBar'
import { TitleBarSpace } from './TitleBarSpace'

export class BitTitleBar extends React.Component<OrbitIntegrationMainProps<any>> {
  render() {
    const { searchBar, normalizedItem } = this.props
    return (
      <>
        <AppSimpleTitleBar normalizedItem={normalizedItem} />
        <Row alignItems="center" height={38} margin={[5, 0, 0]}>
          {searchBar}
          <TitleBarSpace />
          <BitTitleActions normalizedItem={normalizedItem} />
        </Row>
      </>
    )
  }
}
