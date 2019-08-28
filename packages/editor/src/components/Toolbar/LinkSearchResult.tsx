import { NextIcon } from 'outline-icons'
import * as React from 'react'
import styled from 'styled-components'

type Props = any & {
  onClick: (Event) => void
  title: string
}

export class LinkSearchResult extends React.Component<Props> {
  render() {
    const { title, ...rest } = this.props
    return (
      <ListItem {...rest} href="">
        <i>
          <NextIcon light />
        </i>
        {title}
      </ListItem>
    )
  }
}

const ListItem = styled.a`
  display: flex;
  align-items: center;
  height: 28px;
  padding: 6px 8px 6px 0;
  color: ${props => props.theme.toolbarItem};
  font-family: ${props => props.theme.fontFamily};
  font-size: 15px;
  text-decoration: none;
  overflow: hidden;
  white-space: nowrap;

  i {
    visibility: hidden;
  }

  &:hover,
  &:focus,
  &:active {
    font-weight: 500;
    outline: none;

    i {
      visibility: visible;
    }
  }
`
