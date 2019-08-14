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
    where: { id: +props.id! },
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

function BitTitleBar({ bit }: { bit: Bit }) {
  const normalizedItem = normalizeItem(bit)
  const link = normalizedItem.desktopLink || normalizedItem.webLink
  return (
    <ToolbarChrome space padding={[12, 6]}>
      {!!normalizedItem.locationLink && (
        <Button
          alt="flat"
          circular
          iconSize={16}
          onClick={() => {
            openItem(normalizedItem.locationLink!)
          }}
          icon={normalizedItem.icon}
        >
          {normalizedItem.location}
        </Button>
      )}
      {!!link && (
        <Button
          alt="flat"
          onClick={() => {
            openItem(link)
          }}
          icon="share"
          tooltip="Open"
          iconAfter
        >
          Open
        </Button>
      )}

      <View flex={1} />

      <Button alt="flat" circular icon="plus" tooltip="Drag to use in app" />
    </ToolbarChrome>
  )
}

const ToolbarChrome = gloss(Row, {
  alignItems: 'center',
})
