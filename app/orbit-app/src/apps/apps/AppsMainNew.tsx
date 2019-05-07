import { AppBit, AppIcon } from '@o/kit'
import { Input, Popover, Row, Space, View } from '@o/ui'
import React, { useEffect, useRef } from 'react'

import { useOm } from '../../om/om'
import { ColorPicker } from '../../views/ColorPicker'

export function AppsMainNew({ app }: { app: AppBit }) {
  const { state, actions } = useOm()
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
          popoverTheme="tooltip"
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
              actions.setupApp.update({ colors })
            }}
            activeColor={state.setupApp.app.colors[0]}
          />
        </Popover>

        <Space />

        <Input
          ref={inputRef}
          size={1.5}
          placeholder="Name..."
          margin={['auto', 0]}
          value={state.setupApp.app.name}
          onFocus={e => {
            e.target.select()
          }}
          onChange={e => {
            actions.setupApp.update({ name: e.target.value })
          }}
        />
      </Row>
    </>
  )
}
