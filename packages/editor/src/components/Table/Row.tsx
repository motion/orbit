import * as React from 'react'
import styled from 'styled-components'

import { SlateNodeProps } from '../../types'

const StyledTr = styled.tr`
  position: relative;
  border-bottom: 1px solid ${props => props.theme.tableDivider};
`

export const Row = ({ children, attributes }: SlateNodeProps) => {
  return <StyledTr {...attributes}>{children}</StyledTr>
}
