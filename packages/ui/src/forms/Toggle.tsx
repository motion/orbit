import { ThemeObject, useTheme } from '@o/gloss'
import React from 'react'
import Switch, { ReactSwitchProps } from 'react-switch'
import { useToggle } from '../hooks/useToggle'

type ToggleProps = ReactSwitchProps & {
  defaultChecked?: boolean
  boxShadow?: string
  type?: 'checkbox'
  onChange?: (checked: boolean) => any
  theme?: Object
}

export function Toggle(props: ToggleProps) {
  const theme = useTheme()
  const internal = useToggle(props.defaultChecked)
  const checked = typeof props.checked !== 'undefined' ? props.checked : internal.val
  const colorProps = props.theme ? props.theme : toggleTheme(theme)
  return (
    <Switch
      {...colorProps}
      {...props}
      checked={checked}
      onChange={next => (props.onChange ? props.onChange(next) : internal.setState(next))}
    />
  )
}

function toggleTheme(theme: ThemeObject) {
  return {
    boxShadow: undefined,
    offColor: theme.backgroundDarker.hex(),
    onColor: theme.backgroundDarker.hex(),
    offHandleColor: theme.backgroundLightest.hex(),
    onHandleColor: theme.backgroundLightest.hex(),
  }
}
