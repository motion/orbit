/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { view } from '@mcro/black'
import { colors } from '../helpers/colors'

export const inputStyle = {
  border: `1px solid ${colors.light15}`,
  borderRadius: 4,
  font: 'inherit',
  fontSize: '1em',
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
}

export const TableInput = view('input', inputStyle)

TableInput.defaultProps = {
  type: 'text',
}
