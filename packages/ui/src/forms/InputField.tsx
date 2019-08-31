import React from 'react'

import { Input, InputProps } from './Input'
import { SimpleFormField, SimpleFormFieldProps } from './SimpleFormField'

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
