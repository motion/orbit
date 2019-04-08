import { AppIcon } from '@o/kit'
import { Input, Popover, Row, Space, View } from '@o/ui'
import React, { useEffect, useRef } from 'react'
import { useStores } from '../../hooks/useStores'
import { ColorPicker } from '../../views/ColorPicker'

export function AppsMainNew() {
  const { newAppStore } = useStores()
  const { app } = newAppStore
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [inputRef.current])

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
              <AppIcon removeStroke app={app} size={48} />
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

        <Space />

        <Input
          ref={inputRef}
          size={1.5}
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
}
