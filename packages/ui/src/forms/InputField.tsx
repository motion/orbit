import React, { HTMLAttributes } from 'react'
import { SimpleFormField, SimpleFormFieldProps } from './FormField'
import { Input } from './Input'

export function InputField({
  label,
  ...props
}: SimpleFormFieldProps & HTMLAttributes<HTMLInputElement>) {
  return (
    <SimpleFormField label={label}>
      <Input id={name} name={name} {...props} />
    </SimpleFormField>
  )
}
