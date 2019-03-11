import { Absolute, BarButton, Button, Input, Popover, Row, SegmentedRow, View } from '@o/ui'
import { Picker } from 'emoji-mart'
import React, { useState } from 'react'

export function CreateFolder(props: { onAdd: (name: string) => any }) {
  const [name, setName] = useState('')
  const [isShown, setIsShown] = useState(false)

  return (
    <View position="relative" flex={1} justifyContent="center">
      <BarButton
        icon="folderadd"
        transition="transform ease 200ms"
        transform={{
          x: isShown ? -50 : 0,
        }}
        onClick={() => {
          setIsShown(!isShown)
        }}
      />

      <Row
        position="absolute"
        top={3}
        left={0}
        transition="transform ease 200ms"
        transform={{
          x: isShown ? 0 : -250,
        }}
        flex={1}
      >
        <Absolute top={-10} left={-10} zIndex={10}>
          <Button
            onClick={() => setIsShown(false)}
            ignoreSegment
            icon="remove"
            size={0.7}
            iconSize={12}
            circular
          />
        </Absolute>
        <SegmentedRow>
          <Popover
            width={368}
            height={452}
            openOnClick
            // closeOnClickAway
            target={
              <Button
                sizeRadius={3}
                sizePadding={0.5}
                icon={
                  <View marginLeft={4} fontSize={18}>
                    😓
                  </View>
                }
                iconSize={14}
                type="submit"
              />
            }
            background
            borderRadius={10}
            elevation={4}
          >
            <Picker native title="Choose emoji..." />
          </Popover>
          <Input
            sizeRadius={3}
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => {
              if (e.keyCode === 91) {
                // esc
                setIsShown(false)
                return
              }
              // todo submit
              if (e.keyCode === 13) {
                // enter
                setName('')
                props.onAdd(name)
              }
            }}
            flex={1}
            placeholder="New folder..."
          />
        </SegmentedRow>
      </Row>
    </View>
  )
}
