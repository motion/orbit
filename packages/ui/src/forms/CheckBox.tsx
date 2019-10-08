import { gloss } from 'gloss'
import { HTMLProps } from 'react'

export const CheckBox = gloss<HTMLProps<HTMLInputElement>>('input', {
  margin: 'auto',
})

CheckBox.defaultProps = {
  type: 'checkbox',
}
