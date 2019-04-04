import React from 'react'
import { SimpleFormField, SimpleFormFieldProps } from './FormField'
import { Input, InputProps } from './Input'

export function InputField({ label, ...props }: SimpleFormFieldProps & InputProps) {
  return (
    <SimpleFormField name={name} label={label}>
      <Input id={name} name={name} {...props} />
    </SimpleFormField>
  )
}
