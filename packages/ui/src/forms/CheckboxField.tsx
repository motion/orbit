import React, { HTMLProps } from 'react'

import { SimpleFormField, SimpleFormFieldProps } from './FormField'

export function CheckBoxField({
  label,
  children,
  layout,
  ...props
}: SimpleFormFieldProps & HTMLProps<HTMLInputElement>) {
  if (children) {
    console.warn('no children allowed for checkbox', children)
  }
  return (
    <SimpleFormField label={label} layout={layout}>
      <input id={name} name={name} style={{ margin: `auto 4px` }} type="checkbox" {...props} />
    </SimpleFormField>
  )
}
