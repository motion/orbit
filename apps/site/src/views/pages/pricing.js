import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as View from '~/views'
import * as Constants from '~/constants'
import Header from './views/header'

@view
export default class PricingPage {
  render() {
    return (
      <View.Section>
        <Header />
      </View.Section>
    )
  }
}
