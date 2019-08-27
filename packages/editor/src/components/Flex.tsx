import * as React from 'react'
import styled from 'styled-components'

type JustifyValues = 'center' | 'space-around' | 'space-between' | 'flex-start' | 'flex-end'

type AlignValues = 'stretch' | 'center' | 'baseline' | 'flex-start' | 'flex-end'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  column?: boolean
  align?: AlignValues
  justify?: JustifyValues
  auto?: boolean
  className?: string
  children?: React.ReactNode
}

export const Flex = (props: Props) => {
  const { children, ...restProps } = props
  return <Container {...restProps}>{children}</Container>
}

const Container = styled.div`
  display: flex;
  flex: ${({ auto }) => (auto ? '1 1 auto' : 'initial')};
  flex-direction: ${({ column }) => (column ? 'column' : 'row')};
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
`
