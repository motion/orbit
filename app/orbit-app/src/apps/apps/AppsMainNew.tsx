import { AppBit, AppIcon } from '@o/kit'
import { allIcons, Col, FormField, IconShape, Input, Row, useThrottledFn } from '@o/ui'
import memoize from 'memoize-weak'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useNewAppStore } from '../../om/stores'
import { ColorPicker } from '../../views/ColorPicker'

export function AppsMainNew({
  app,
  customizeColor,
  customizeIcon,
}: {
  app: AppBit
  customizeColor?: boolean
  customizeIcon?: boolean
}) {
  const newAppStore = useNewAppStore()
  const inputRef = useRef(null)
  const [activeIcon, setActiveIcon] = useState('')
  const updateName = useThrottledFn(name => newAppStore.update({ name }), {
    amount: 100,
  })

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [inputRef.current])

  return (
    <Col space>
      <FormField label="Name">
        <Input
          ref={inputRef}
          size={1.5}
          placeholder={app.name}
          margin={['auto', 0]}
          defaultValue={newAppStore.app.name}
          onChange={useCallback(e => updateName(e.target.value), [])}
        />
      </FormField>
      {(customizeColor || customizeIcon) && (
        <FormField label="Icon">
          <Row space alignItems="center" overflow="hidden">
            <AppIcon identifier={app.identifier} colors={newAppStore.app.colors} size={48} />
            <Col flex={1}>
              {customizeColor && (
                <ColorPicker
                  onChangeColor={colors => {
                    newAppStore.update({ colors })
                  }}
                  activeColor={newAppStore.app.colors[0]}
                />
              )}
              {customizeIcon && <IconPicker active={activeIcon} onChange={setActiveIcon} />}
            </Col>
          </Row>
        </FormField>
      )}
    </Col>
  )
}

type IconPickerProps = {
  active?: string
  onChange?: (icon: string) => any
}

function IconPicker(props: IconPickerProps) {
  const setupOnClick = memoize(icon => () => {
    props.onChange && props.onChange(icon.iconName)
  })

  return (
    <Row space pad="sm" scrollable="x" hideScrollbars flex={1}>
      {allIcons.slice(20, 100).map(icon => {
        console.log('icon, icon', icon)
        return (
          <IconShape
            key={icon.iconName}
            active={props.active === icon.iconName}
            onClick={setupOnClick(icon)}
            name={icon.iconName}
            // gradient={['#555', '#555']}
            size={32}
          />
        )
      })}
    </Row>
  )
}
