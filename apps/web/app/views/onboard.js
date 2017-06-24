// @flow
import React from 'react'
import { view } from '@jot/black'
import { Drawer, Segment, Button } from '~/ui'
import { User } from '@jot/models'
import Router from '~/router'
import Page from '~/page'

@view({
  store: class OnboardStore {
    get show() {
      return true //!User.org
    }

    step = 0

    setStep = (val: number) => {
      this.step = val
    }
  },
})
export default class OnboardPage {
  render({ store }) {
    return (
      <fml>
        welcome to jot
      </fml>
    )
  }

  static style = {
    onboard: {
      zIndex: 10000,
    },
  }
}
