import * as React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'

const Link = ({ to, ...props }) => (
  <a
    href={to}
    onClick={e => {
      e.preventDefault()
      Router.go(to)
    }}
    {...props}
  />
)

@view
export default class Header extends React.Component {
  render() {
    return (
      <header>
        <img src="/DeliverX.svg" />
        <nav $$row>
          <Link to="/map">Map</Link>
          <Link to={'/drivers'}>Drivers</Link>
        </nav>
      </header>
    )
  }

  static style = {
    header: {
      background: '#f2f2f2',
      padding: [0, 20],
      marginBottom: 10,
      flexFlow: 'row',
      alignItems: 'center',
    },
    img: {
      margin: [-5, 0, -25, 0],
      width: 200,
    },
  }
}
