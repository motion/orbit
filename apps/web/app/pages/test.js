import React from 'react'
import { view } from '~/helpers'
import { Document } from '@jot/models'
import Page from '~/views/page'
import Overdrive from 'react-overdrive'
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
          <Overdrive id="boo" key={'boo'} if={store.align == 'left'}>
            <h1>big text</h1>
          </Overdrive>
          <Overdrive
            id="boo"
            key={'boo'}
            style={{ marginLeft: 800 }}
            if={store.align == 'center'}
          >
            <h3>small</h3>
          </Overdrive>

          <up onClick={() => store.align = 'left'}>left</up>
          <up onClick={() => store.align = 'center'}>center</up>
          <up onClick={() => store.align = 'right'}>right</up>
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
