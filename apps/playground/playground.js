// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import Interface from './interface'
import Data from './data'

type Props = {}

@view
export default class Main extends React.PureComponent<Props> {
  render() {
    return (
      <main>
        <Data />
        <Interface if={false} />
      </main>
    )
  }
}
