import { gloss } from 'gloss'
import { HTMLProps } from 'react'

export const TableInput = gloss<HTMLProps<HTMLInputElement>>('input', {
  borderRadius: 4,
  font: 'inherit',
  fontSize: 16,
  marginRight: 5,
  padding: [0, 5],
  height: 28,
  lineHeight: 28,
  compact: {
    height: 17,
    lineHeight: 17,
  },
  '&:disabled': {
    backgroundColor: '#ddd',
    borderColor: '#ccc',
    cursor: 'not-allowed',
  },
}).theme(props => ({
  border: [1, props.borderColor],
}))

TableInput.defaultProps = {
  type: 'text',
}
