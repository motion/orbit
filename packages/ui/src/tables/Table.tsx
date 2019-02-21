import { gloss, Row, View } from '@mcro/gloss'
import React from 'react'

export const Table = gloss(View, {
  width: '100%',
})

export const TableCell = gloss(View, {
  padding: [4, 0],
})

export const FormTableRow = gloss(Row, {
  width: '100%',
  maxWidth: 500,
  minHeight: 32,
  alignItems: 'center',
})

export type RowProps = {
  label?: React.ReactNode
}

export const Scrollable = gloss(View, {
  overflowY: 'auto',
})

export const FormTableLabel = ({ children }) => (
  <TableCell width="30%" maxWidth={125}>
    {children}
  </TableCell>
)

export const FormTableValue = ({ children }) => <TableCell width="70%">{children}</TableCell>
