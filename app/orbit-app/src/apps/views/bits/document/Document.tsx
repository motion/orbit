import * as React from 'react'
import { Title } from '../../../../views'

export const Document = ({ title, children }) => {
  return (
    <>
      <Title>{title}</Title>
      {children}
    </>
  )
}
