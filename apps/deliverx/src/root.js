import * as React from 'react'
import { view } from '@mcro/black'

@view
export default class RootPage extends React.Component {
  render() {
    return <page>DeliverX</page>
  }

  static style = {
    page: {},
  }
}
