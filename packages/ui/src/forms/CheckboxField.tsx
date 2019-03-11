import React from 'react'
import { FormTableLabel, FormTableRow, FormTableValue } from '../tables/Table'
import { InputProps } from './Input'
import { Label } from './Label'

export const CheckBoxField = ({
  name = `checkbox-${Math.random()}`,
  children,
  checked,
  onChange,
}: InputProps & { checked?: boolean; onChange: (checked: boolean) => any }) => (
  <FormTableRow>
    <FormTableLabel>
      <Label htmlFor={name}>{children}</Label>
    </FormTableLabel>
    <FormTableValue>
      <input
        id={name}
        name={name}
        checked={checked}
        onChange={onChange && (e => onChange(e.target.checked))}
        style={{ margin: `auto 4px` }}
        type="checkbox"
      />
    </FormTableValue>
  </FormTableRow>
)
