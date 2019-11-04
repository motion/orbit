import React from 'react'

import { Input, InputProps } from './Input'

export type TextAreaProps = InputProps

export const TextArea = (props: TextAreaProps) => (
  <Input showInnerElement="never" tagName="textarea" sizeRadius={false} {...props} />
)
