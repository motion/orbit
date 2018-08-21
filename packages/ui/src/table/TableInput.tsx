import { view } from '@mcro/black'

export const TableInput = view('input', {
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
})

TableInput.theme = ({ theme }) => ({
  border: [1, theme.borderColor],
})

TableInput.defaultProps = {
  type: 'text',
}
