import React from 'react'

import { SimpleFormField, SimpleFormFieldProps } from './SimpleFormField'
import { Toggle, ToggleProps } from './Toggle'

export function ToggleField({
  label,
  children,
  layout,
  name,
  ...props
}: SimpleFormFieldProps & ToggleProps) {
  if (children) {
    console.warn('no children allowed for checkbox', children)
  }
  return (
    <SimpleFormField label={label} layout={layout}>
      <Toggle id={name} {...props} />
    </SimpleFormField>
  )
}
