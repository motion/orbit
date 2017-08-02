// @flow
import React from 'react'
import { view } from '@mcro/black'
import Interface from './interface'
import Data from './data'

@view
export default class Main {
  render() {
    return (
      <main>
        <Data />
        <Interface if={false} />
      </main>
    )
  }
}
