import { useModel } from '@o/bridge'
import { gloss, Row } from '@o/gloss'
import { App, AppProps, createApp, HighlightedSearchable, ItemView } from '@o/kit'
import { Bit, BitModel } from '@o/models'
import { Button, ItemPropsProvider, normalizeItem, Space, SpaceGroup, View } from '@o/ui'
import * as React from 'react'

export default createApp({
  id: 'bit',
  name: 'Bit',
  icon: '',
  app: props => (
    <App>
      <BitAppMain {...props} />
    </App>
  ),
})

const defaultItemProps = {
  itemProps: {
    padding: [1, 8],
    '&:hover': {
      background: [0, 0, 0, 0.02],
    },
  },
}

export function BitAppMain(props: AppProps) {
  const [bit] = useModel(BitModel, {
    where: { id: +props.id },
    relations: ['people'],
  })
  if (!bit) {
    return null
  }
  return (
    <ItemPropsProvider value={defaultItemProps}>
      <HighlightedSearchable>
        {({ searchBar }) => (
          <>
            <BitTitleBar bit={bit} searchBar={searchBar} />
            <ItemView item={bit} />
          </>
        )}
      </HighlightedSearchable>
    </ItemPropsProvider>
  )
}

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
