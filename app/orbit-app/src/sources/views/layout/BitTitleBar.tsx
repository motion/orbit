import { gloss, Row } from '@mcro/gloss'
import { Bit } from '@mcro/models'
import { Popover, SegmentedRow, View } from '@mcro/ui'
import * as React from 'react'
import { AppActions } from '../../../actions/AppActions'
import SearchItemShare, { SearchItemShareProvide } from '../../../apps/search/SearchItemShare'
import { NormalItem } from '../../../helpers/normalizeItem'
import { HorizontalSpace } from '../../../views'
import { TitleBarButton } from './TitleBarButton'
import { TitleBarSpace } from './TitleBarSpace'

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
            {isShown => isShown && <SearchItemShare />}
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
}).theme((_, theme) => ({
  borderBottom: [1, theme.borderColor.alpha(a => a * 0.2)],
}))
