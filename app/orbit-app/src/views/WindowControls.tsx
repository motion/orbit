import * as React from 'react'
import { ControlButton } from './ControlButton'
import { View, Row } from '@mcro/ui'

export const WindowCloseButton = props => <ControlButton icon="x" background="#FF6159" {...props} />

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
    <Row alignItems="center">
      {!!onClose && <WindowCloseButton onClick={onClose} {...itemProps} {...closeProps} />}
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
    </Row>
  )
}
