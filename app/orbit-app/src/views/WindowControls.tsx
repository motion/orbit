import { Row, View } from '@mcro/ui'
import * as React from 'react'
import { ControlButton } from './ControlButton'

export const WindowCloseButton = props => <ControlButton icon="x" background="#FF6159" {...props} />
export const WindowMaxButton = props => <ControlButton icon="z" background="#62C554" {...props} />
export const WindowMinButton = props => <ControlButton icon="y" background="#F6BE4F" {...props} />

export const WindowControls = ({
  spaceBetween = 6,
  onClose = null,
  onMax = null,
  onMin = null,
  maxProps = null,
  closeProps = null,
  minProps = null,
  itemProps = null,
}: any) => {
  return (
    <Row alignItems="center">
      {!!onClose && <WindowCloseButton onClick={onClose} {...itemProps} {...closeProps} />}
      {!!onMax && (
        <>
          <View width={spaceBetween} />
          <WindowMinButton onClick={onMax} {...itemProps} {...maxProps} />
        </>
      )}
      {!!onMin && (
        <>
          <View width={spaceBetween} />
          <WindowMaxButton onClick={onMin} {...itemProps} {...minProps} />
        </>
      )}
    </Row>
  )
}
