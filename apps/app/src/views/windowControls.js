import * as React from 'react'
import { ControlButton } from '~/views/controlButton'

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
    <buttons $$row {...props}>
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
    </buttons>
  )
}
