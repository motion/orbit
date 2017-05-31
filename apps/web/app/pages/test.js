import React from 'react'
import { view } from '~/helpers'
import { Document } from '@jot/models'
import Page from '~/views/page'
import { flatten } from 'lodash'

class TestStore {
  align = 'left'
}

@view({
  store: TestStore,
})
export default class Test {
  render({ store }) {
    return (
      <Page header title="Todo" actions={[]}>
        <test style={{ padding: 20 }}>
          <h5>just a page for testing</h5>
        </test>
      </Page>
    )
  }

  static style = {
    todo: {
      flexFlow: 'row',
    },
  }
}
