import { AppBit, AppIcon } from '@o/kit'
import { Col, FormField, Input } from '@o/ui'
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
    <Col space>
      <FormField label="Icon">
        <AppIcon identifier={app.identifier} colors={app.colors} size={48} />
        <ColorPicker
          onChangeColor={colors => {
            actions.setupApp.update({ colors })
          }}
          activeColor={state.setupApp.app.colors[0]}
        />
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
