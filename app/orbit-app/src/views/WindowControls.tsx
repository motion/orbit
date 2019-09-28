import { Stack, View } from '@o/ui'
import React, { useState } from 'react'

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
  showOnHover = { max: false, min: false },
}: any) => {
  const [show, setShow] = useState(false)

  return (
    <Stack
      direction="horizontal"
      zIndex={show ? 1000000 : 0}
      padding={show ? 8 : 3}
      margin={show ? -8 : -3}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      alignItems="center"
    >
      {!!onClose && <WindowCloseButton onClick={onClose} {...itemProps} {...closeProps} />}
      {!!onMax && (!showOnHover.max || show) && (
        <>
          <View width={spaceBetween} />
          <WindowMinButton onClick={onMax} {...itemProps} {...maxProps} />
        </>
      )}
      {!!onMin && (!showOnHover.min || show) && (
        <>
          <View width={spaceBetween} />
          <WindowMaxButton onClick={onMin} {...itemProps} {...minProps} />
        </>
      )}
    </Stack>
  )
}
