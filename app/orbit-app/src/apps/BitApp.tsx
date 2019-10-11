import { useModel } from '@o/bridge'
import { AppViewProps, createApp, ItemView, openItem } from '@o/kit'
import { Bit, BitModel } from '@o/models'
import { Button, ItemPropsProvider, normalizeItem, Stack, Text, View } from '@o/ui'
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
    hoverStyle: {
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
      <Stack flex={1} scrollable="y" padding>
        <ItemView item={bit} />
      </Stack>
    </ItemPropsProvider>
  )
}

function BitTitleBar({ bit }: { bit: Bit }) {
  const normalizedItem = normalizeItem(bit)
  const link = normalizedItem.desktopLink || normalizedItem.webLink
  return (
    <Stack direction="horizontal" alignItems="center" space="sm" padding={[12, 12]}>
      {!!normalizedItem.locationLink && (
        <Button
          coat="flat"
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
          coat="flat"
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

      <View flex={4} overflow="hidden" alignItems="center" justifyContent="center">
        <Text ellipse>{bit.title}</Text>
      </View>

      <View flex={1} />

      <Button coat="flat" circular size={1.1} icon="plus" tooltip="Drag to use in app" />
    </Stack>
  )
}
