import * as React from 'react'
import { ControlButton } from './ControlButton'
import { View } from '@mcro/ui'

export const WindowControls = ({
  spaceBetween = 4,
  onClose = null,
  onMax = null,
  onMin = null,
  maxProps = null,
  closeProps = null,
  minProps = null,
  itemProps = null,
}) => {
  return (
    <>
      {!!onClose && (
        <ControlButton
          icon="x"
          onClick={onClose}
          background="#FF6159"
          {...itemProps}
          {...closeProps}
        />
      )}
      {!!onMax && (
        <>
          <View width={spaceBetween} />
          <ControlButton
            onClick={onMax}
            icon="y"
            background="#F6BE4F"
            {...itemProps}
            {...maxProps}
          />
        </>
      )}
      {!!onMin && (
        <>
          <View width={spaceBetween} />
          <ControlButton
            onClick={onMin}
            icon="z"
            background="#62C554"
            {...itemProps}
            {...minProps}
          />
        </>
      )}
    </>
  )
}
