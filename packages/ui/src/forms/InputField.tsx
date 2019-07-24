import React from 'react'

import { SimpleFormField, SimpleFormFieldProps } from './FormField'
import { Input, InputProps } from './Input'

export function InputField({
  name,
  label,
  layout,
  description,
  ...props
}: SimpleFormFieldProps & InputProps) {
  return (
    <SimpleFormField name={name} label={label} layout={layout} description={description}>
      <Input id={name} name={name} {...props} />
    </SimpleFormField>
  )
}
