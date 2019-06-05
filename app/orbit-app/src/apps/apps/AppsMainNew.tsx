import { AppBit, AppIcon } from '@o/kit'
import { allIcons, Col, FormField, IconShape, Input, Row } from '@o/ui'
import memoize from 'memoize-weak'
import React, { useEffect, useRef, useState } from 'react'

import { useOm } from '../../om/om'
import { ColorPicker } from '../../views/ColorPicker'

export function AppsMainNew({ app }: { app: AppBit }) {
  const { state, actions } = useOm()
  const inputRef = useRef(null)
  const [activeIcon, setActiveIcon] = useState('')

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [inputRef.current])

  return (
    <Col space>
      <FormField label="Icon">
        <Row space alignItems="center" overflow="hidden">
          <AppIcon identifier={app.identifier} colors={app.colors} size={48} />
          <Col flex={1}>
            <ColorPicker
              onChangeColor={colors => {
                actions.setupApp.update({ colors })
              }}
              activeColor={state.setupApp.app.colors[0]}
            />
            <IconPicker active={activeIcon} onChange={setActiveIcon} />
          </Col>
        </Row>
      </FormField>
      <FormField label="Name">
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
      </FormField>
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
      {allIcons.map(icon => {
        return (
          <IconShape
            key={icon.iconName}
            active={props.active === icon.iconName}
            onClick={setupOnClick(icon)}
            name={icon.iconName}
            size={32}
          />
        )
      })}
    </Row>
  )
}
