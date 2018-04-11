import * as React from 'react'
import { view } from '@mcro/black'
import ControlButton from '~/views/controlButton'

@view
export default class WindowControls {
  render({ onClose, onMax, onMin }) {
    return (
      <buttons $$row css={{ marginRight: 14 }}>
        <ControlButton if={onClose} icon="x" onClick={onClose} />
        <ControlButton
          if={onMax}
          onClick={onMax}
          icon="y"
          background="#F6BE4F"
        />
        <ControlButton
          if={onMin}
          onClick={onMin}
          icon="z"
          background="#62C554"
        />
      </buttons>
    )
  }
}
