import { gloss, Row } from '@mcro/gloss'
import { SegmentedRow, View } from '@mcro/ui'
import * as React from 'react'
import { AppActions } from '../../../actions/AppActions'
import { NormalItem } from '../../../helpers/normalizeItem'
import { TitleBarButton } from './TitleBarButton'
import { TitleBarSpace } from './TitleBarSpace'

export class BitTitleBar extends React.Component<{
  searchBar: any
  normalizedItem: NormalItem
}> {
  render() {
    const { searchBar, normalizedItem } = this.props
    return (
      <ToolbarChrome>
        {searchBar}
        <View flex={1} />
        <TitleBarSpace />
        <SegmentedRow spaced>
          <TitleBarButton
            onClick={() => {
              AppActions.open(normalizedItem.locationLink)
              AppActions.setOrbitDocked(false)
            }}
            icon={normalizedItem.icon}
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
      </ToolbarChrome>
    )
  }
}

const ToolbarChrome = gloss(Row, {
  alignItems: 'center',
  height: 48,
  padding: [6, 10],
}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColor.alpha(0.2)],
}))
