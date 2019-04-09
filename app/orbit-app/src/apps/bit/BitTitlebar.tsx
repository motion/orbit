import { gloss, Row } from '@o/gloss'
import { normalizeItem, SearchItemShareProvide } from '@o/kit'
import { Bit } from '@o/models'
import { Popover, SegmentedRow, Space, TitleBarButton, TitleBarSpace, View } from '@o/ui'
import * as React from 'react'

// import { AppActions } from '../../../actions/appActions/AppActions'

export class BitTitleBar extends React.Component<{
  searchBar: any
  bit: Bit
}> {
  render() {
    const { bit, searchBar } = this.props
    const normalizedItem = normalizeItem(bit)
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

        <Space />

        <SearchItemShareProvide item={bit}>
          <Popover
            openOnClick
            closeOnClickAway
            distance={5}
            width={250}
            height={300}
            target={<TitleBarButton tooltip="Open" icon="more" />}
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
