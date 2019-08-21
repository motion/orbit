import React from 'react'

import { Input, InputProps } from './Input'

export type TextAreaProps = InputProps

export const TextArea = (props: TextAreaProps) => (
  <Input noInnerElement tagName="textarea" sizeRadius={false} {...props} />
)
