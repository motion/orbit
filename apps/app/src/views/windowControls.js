import * as React from 'react'
import { ControlButton } from '~/views/ControlButton'
import * as UI from '@mcro/ui'

export const WindowControls = ({
  onClose,
  onMax,
  onMin,
  maxProps,
  closeProps,
  minProps,
  itemProps,
  ...props
}) => {
  return (
    <UI.Row {...props}>
      <ControlButton
        if={onClose}
        icon="x"
        onClick={onClose}
        {...itemProps}
        {...closeProps}
      />
      <ControlButton
        if={onMax}
        onClick={onMax}
        icon="y"
        background="#F6BE4F"
        {...itemProps}
        {...maxProps}
      />
      <ControlButton
        if={onMin}
        onClick={onMin}
        icon="z"
        background="#62C554"
        {...itemProps}
        {...minProps}
      />
    </UI.Row>
  )
}
