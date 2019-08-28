import styled from 'styled-components'

export const Grip = styled.a`
  position: absolute;
  cursor: pointer;
  background: ${props => (props.isSelected ? props.theme.tableSelected : props.theme.tableDivider)};

  ${props => props.isSelected && 'opacity: 1 !important;'}

  &:hover {
    background: ${props =>
      props.isSelected ? props.theme.tableSelected : props.theme.toolbarBackground};
  }
`
