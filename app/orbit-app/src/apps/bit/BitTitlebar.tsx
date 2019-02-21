import { gloss, Row } from '@mcro/gloss'
import { NormalItem, SearchItemShareProvide } from '@mcro/kit'
import { Bit } from '@mcro/models'
import {
  HorizontalSpace,
  Popover,
  SegmentedRow,
  TitleBarButton,
  TitleBarSpace,
  View,
} from '@mcro/ui'
import * as React from 'react'
// import { AppActions } from '../../../actions/appActions/AppActions'

export class BitTitleBar extends React.Component<{
  searchBar: any
  bit: Bit
  normalizedItem: NormalItem
}> {
  render() {
    const { bit, searchBar, normalizedItem } = this.props
    return (
      <ToolbarChrome>
        {searchBar}
        <View flex={1} />
        <TitleBarSpace />
        <SegmentedRow spaced>
          <TitleBarButton
            onClick={() => {
              // !TODO
              // AppActions.open(normalizedItem.locationLink)
              // AppActions.setOrbitDocked(false)
            }}
            icon={normalizedItem.icon}
          >
            {normalizedItem.location}
          </TitleBarButton>
          <TitleBarButton
            onClick={() => {
              // !TODO
              // AppActions.open(normalizedItem.desktopLink || normalizedItem.webLink)
              // AppActions.setOrbitDocked(false)
            }}
            tooltip="Open"
            iconAfter
          >
            Open
          </TitleBarButton>
        </SegmentedRow>

        <HorizontalSpace />

        <SearchItemShareProvide item={bit}>
          <Popover
            openOnClick
            closeOnClickAway
            distance={5}
            width={250}
            height={300}
            target={<TitleBarButton tooltip="Open" icon="dots" />}
            background
            borderRadius={10}
            elevation={1}
          >
            {/* !TODO we need a ShareMenu component */}
            {/* {isShown => isShown && <SearchItemShare />} */}
          </Popover>
        </SearchItemShareProvide>
      </ToolbarChrome>
    )
  }
}

const ToolbarChrome = gloss(Row, {
  alignItems: 'center',
  height: 38,
  padding: [5, 10],
})
