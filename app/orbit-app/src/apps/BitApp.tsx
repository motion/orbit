import { useModel } from '@o/bridge'
import { App, AppViewProps, createApp, ItemView } from '@o/kit'
import { Bit, BitModel } from '@o/models'
import { Button, Col, ItemPropsProvider, normalizeItem, Space, SpaceGroup, View } from '@o/ui'
import { gloss, Row } from 'gloss'
import * as React from 'react'

import { AppActions } from '../actions/AppActions'

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

export function BitAppMain(props: AppViewProps) {
  const [bit] = useModel(BitModel, {
    where: { id: +props.id },
    relations: ['people'],
  })
  if (!bit) {
    return null
  }
  return (
    <ItemPropsProvider value={defaultItemProps}>
      <BitTitleBar bit={bit} />
      <Col flex={1} scrollable>
        <ItemView item={bit} />
      </Col>
    </ItemPropsProvider>
  )
}

export class BitTitleBar extends React.Component<{
  bit: Bit
}> {
  render() {
    const { bit } = this.props
    const normalizedItem = normalizeItem(bit)
    return (
      <ToolbarChrome>
        <View flex={1} />
        <Space />
        <SpaceGroup space="sm">
          <Button
            alt="flat"
            circular
            iconSize={16}
            onClick={() => {
              AppActions.open(normalizedItem.locationLink)
            }}
            icon={normalizedItem.icon}
          >
            {normalizedItem.location}
          </Button>
          <Button
            alt="flat"
            onClick={() => {
              AppActions.open(normalizedItem.desktopLink || normalizedItem.webLink)
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
