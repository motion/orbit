import { AppBit } from '@mcro/models'
import { Popover, Row, View } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef } from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { HorizontalSpace } from '../../views'
import { AppIcon } from '../../views/AppIcon'
import { ColorPicker } from '../../views/ColorPicker'
import { Input } from '../../views/Input'

export default observer(function AppsMainNew() {
  const { newAppStore } = useStoresSafe()
  const { app } = newAppStore
  const inputRef = useRef(null)

  useEffect(
    () => {
      if (inputRef.current) {
        inputRef.current.focus()
        inputRef.current.select()
      }
    },
    [inputRef.current],
  )

  return (
    <>
      <Row alignItems="center">
        <Popover
          themeName="tooltip"
          borderRadius={10}
          elevation={1}
          openOnClick
          background
          width={250}
          height={250}
          target={
            <View>
              {/* TODO @umed type... */}
              <AppIcon removeStroke app={app as AppBit} size={48} />
            </View>
          }
          overflowY="auto"
          padding={10}
        >
          <ColorPicker
            onChangeColor={colors => {
              newAppStore.update({ colors })
            }}
            activeColor={app.colors[0]}
          />
        </Popover>

        <HorizontalSpace />

        <Input
          ref={inputRef}
          fontSize={18}
          placeholder="Name..."
          margin={['auto', 0]}
          value={app.name}
          onFocus={e => {
            e.target.select()
          }}
          onChange={e => {
            newAppStore.update({ name: e.target.value })
          }}
        />
      </Row>
    </>
  )
})
