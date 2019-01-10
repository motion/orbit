import * as React from 'react'
import { Row, SegmentedRow, View } from '@mcro/ui'
import { TitleBarSpace } from './TitleBarSpace'
import { NormalItem } from '../../../helpers/normalizeItem'
import { TitleBarButton } from './TitleBarButton'
import { AppActions } from '../../../actions/AppActions'
import { Icon } from '../../../views/Icon'

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
          <View flex={1} />
          <TitleBarSpace />
          <SegmentedRow spaced>
            <TitleBarButton
              onClick={() => {
                AppActions.open(normalizedItem.locationLink)
                AppActions.setOrbitDocked(false)
              }}
              icon={<Icon icon={normalizedItem.icon} size={14} />}
            >
              {normalizedItem.location}
            </TitleBarButton>
            <TitleBarButton
              onClick={() => {
                AppActions.open(normalizedItem.desktopLink || normalizedItem.webLink)
                AppActions.setOrbitDocked(false)
              }}
              tooltip="Open"
            >
              Open
            </TitleBarButton>
          </SegmentedRow>
        </Row>
      </>
    )
  }
}
