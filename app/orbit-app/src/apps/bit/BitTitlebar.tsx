import { gloss, Row } from '@o/gloss'
import { normalizeItem } from '@o/kit'
import { Bit } from '@o/models'
import { Button, Space, SpaceGroup, View } from '@o/ui'
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
        <Space />
        <SpaceGroup space="sm">
          <Button
            onClick={() => {
              // !TODO
              // AppActions.open(normalizedItem.locationLink)
              // AppActions.setOrbitDocked(false)
            }}
            icon={normalizedItem.icon}
          >
            {normalizedItem.location}
          </Button>
          <Button
            onClick={() => {
              // !TODO
              // AppActions.open(normalizedItem.desktopLink || normalizedItem.webLink)
              // AppActions.setOrbitDocked(false)
            }}
            icon="share"
            tooltip="Open"
            iconAfter
          >
            Open
          </Button>
        </SpaceGroup>
      </ToolbarChrome>
    )
  }
}

const ToolbarChrome = gloss(Row, {
  alignItems: 'center',
  padding: 8,
})
