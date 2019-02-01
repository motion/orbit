import { App } from '@mcro/models'
import { IconProps, Popover, Row } from '@mcro/ui'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useRef } from 'react'
import { useStoresSafe } from '../../hooks/useStoresSafe'
import { HorizontalSpace } from '../../views'
import { ColorPicker } from '../../views/ColorPicker'
import { Icon } from '../../views/Icon'
import { Input } from '../../views/Input'

export function AppIcon({ app, ...props }: { app: App } & Partial<IconProps>) {
  return (
    <Icon
      background={app.colors[0]}
      color={app.colors[1]}
      name={`orbit-${app.type}-full`}
      size={48}
      {...props}
    />
  )
}

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
          theme="tooltip"
          borderRadius={10}
          elevation={1}
          openOnClick
          background
          width={250}
          height={250}
          target={<AppIcon removeStroke app={app} size={48} />}
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
