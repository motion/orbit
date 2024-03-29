import { CompiledTheme, useTheme } from 'gloss'
import React, { memo } from 'react'
import Switch, { ReactSwitchProps } from 'react-switch'

import { LINE_HEIGHT } from '../constants'
import { useToggle } from '../hooks/useToggle'
import { useScale } from '../Scale'
import { getSize } from '../Sizes'
import { Sizes } from '../Space'
import { Tooltip } from '../Tooltip'

export type ToggleProps = Partial<ReactSwitchProps> & {
  nodeRef?: any
  defaultChecked?: boolean
  boxShadow?: string
  type?: 'checkbox'
  onChange?: (checked: boolean) => any
  theme?: Object
  size?: Sizes
  tooltip?: string
  opacity?: number // todo make this whole switch native element
}

export const Toggle = memo(({ defaultChecked, size, nodeRef, ...props }: ToggleProps) => {
  const theme = useTheme()
  const internal = useToggle(defaultChecked)
  const checked = typeof props.checked !== 'undefined' ? props.checked : internal.val
  const colorProps = props.theme ? props.theme : toggleTheme(theme)
  const scale = useScale()
  const height = props.height || getSize(size) * scale * LINE_HEIGHT * 0.6
  const width = props.width || height * 2
  let element = (
    <Switch
      ref={nodeRef}
      {...colorProps}
      uncheckedIcon={false}
      checkedIcon={false}
      {...props}
      height={height}
      width={width}
      checked={checked}
      onChange={next => (props.onChange ? props.onChange(next) : internal.setState(next))}
    />
  )
  if (props.tooltip) {
    element = (
      <Tooltip label={props.tooltip}>
        <div>{element}</div>
      </Tooltip>
    )
  }
  return element
})

function toggleTheme(theme: CompiledTheme) {
  return {
    boxShadow: undefined,
    offColor: (theme.backgroundStrongest || theme.background).toHexString(),
    onColor: (theme.backgroundStrongest || theme.background).toHexString(),
    offHandleColor: theme.backgroundHighlight.toHexString(),
    onHandleColor: theme.backgroundHighlight.toHexString(),
  }
}
