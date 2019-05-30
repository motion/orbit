import { ThemeObject, useTheme } from 'gloss'
import React from 'react'
import Switch, { ReactSwitchProps } from 'react-switch'

import { useToggle } from '../hooks/useToggle'
import { useScale } from '../Scale'
import { LINE_HEIGHT } from '../SizedSurface'
import { getSize } from '../Sizes'
import { Sizes } from '../Space'

type ToggleProps = Partial<ReactSwitchProps> & {
  defaultChecked?: boolean
  boxShadow?: string
  type?: 'checkbox'
  onChange?: (checked: boolean) => any
  theme?: Object
  size?: Sizes
}

export function Toggle(props: ToggleProps) {
  const theme = useTheme()
  const internal = useToggle(props.defaultChecked)
  const checked = typeof props.checked !== 'undefined' ? props.checked : internal.val
  const colorProps = props.theme ? props.theme : toggleTheme(theme)
  const scale = useScale()
  const height = props.height || getSize(props.size) * scale * LINE_HEIGHT * 0.66
  const width = props.width || height * 2
  return (
    <Switch
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
}

function toggleTheme(theme: ThemeObject) {
  return {
    boxShadow: undefined,
    offColor: theme.backgroundStrongest.hex(),
    onColor: theme.backgroundStrongest.hex(),
    offHandleColor: theme.backgroundZebra.hex(),
    onHandleColor: theme.backgroundHighlight.hex(),
  }
}
