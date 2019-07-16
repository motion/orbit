import { useModel } from '@o/bridge'
import { AppViewProps, createApp, ItemView, openItem } from '@o/kit'
import { Bit, BitModel } from '@o/models'
import { Button, Col, ItemPropsProvider, normalizeItem, Row, View } from '@o/ui'
import { gloss } from 'gloss'
import * as React from 'react'

export default createApp({
  id: 'bit',
  name: 'Bit',
  icon: '',
  app: BitAppMain,
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
      <Col flex={1} scrollable="y" padding>
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
      <ToolbarChrome space padding={['xs', true]}>
        <Button
          alt="flat"
          circular
          iconSize={16}
          onClick={() => {
            openItem(normalizedItem.locationLink)
          }}
          icon={normalizedItem.icon}
        >
          {normalizedItem.location}
        </Button>
        <Button
          alt="flat"
          onClick={() => {
            openItem(normalizedItem.desktopLink || normalizedItem.webLink)
          }}
          icon="share"
          tooltip="Open"
          iconAfter
        >
          Open
        </Button>

        <View flex={1} />

        <Button alt="flat" size={1.4} circular icon="hand" tooltip="Drag to use in app" />
      </ToolbarChrome>
    )
  }
}

const ToolbarChrome = gloss(Row, {
  alignItems: 'center',
  padding: 8,
})
