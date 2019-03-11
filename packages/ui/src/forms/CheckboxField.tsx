import React, { HTMLProps } from 'react'
import { SimpleFormField, SimpleFormFieldProps } from './FormField'

export function CheckBoxField({
  label,
  ...props
}: SimpleFormFieldProps & HTMLProps<HTMLInputElement>) {
  return (
    <SimpleFormField label={label}>
      <input id={name} name={name} style={{ margin: `auto 4px` }} type="checkbox" {...props} />
    </SimpleFormField>
  )
}
