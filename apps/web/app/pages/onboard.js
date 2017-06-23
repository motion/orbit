// @flow
import React from 'react'
import { view } from '@jot/black'
import { Segment, Button } from '~/ui'
import Router from '~/router'
import Page from '~/page'

@view({
  store: class OnboardStore {
    step = 0

    setStep = (val: number) => {
      this.step = val
    }
  },
})
export default class OnboardPage {
  render({ store }) {
    return (
      <Page>
        welcome to jot
      </Page>
    )
  }
}
