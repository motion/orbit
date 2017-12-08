import * as React from 'react'
import { view } from '@mcro/black'
import Router from '~/router'

@view
export default class Header extends React.Component {
  render() {
    return (
      <header>
        <img src="/DeliverX.svg" />

        <nav>
          <a onClick={() => Router.go('/map')} href="">
            Drivers
          </a>
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
