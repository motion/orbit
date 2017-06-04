import React from 'react'
import { $, view } from '~/helpers'
import { pick } from 'lodash'
import { SlotFill } from '~/ui'

@view({
  store: class {
    rendered = false

    start() {
      setTimeout(() => {
        this.rendered = true
      })
    }
  },
})
class Loading {
  render({ store: { rendered } }) {
    return <spinner $show={rendered}>loading</spinner>
  }

  static style = {
    spinner: {
      opacity: 0,
      transition: 'opacity 100ms ease-in 300ms', // wait a bit
      alignSelf: 'center',
      justifyContent: 'cener',
    },
    show: {
      opacity: 1,
    },
  }
}

@view
export default class Page {
  render({ children, sidebar, actions, loading, className }) {
    return (
      <page className={className}>
        <SlotFill.Fill if={actions} name="actions">{actions}</SlotFill.Fill>
        <SlotFill.Fill if={sidebar} name="sidebar">{sidebar}</SlotFill.Fill>
        {children}
        <Loading if={loading} />
      </page>
    )
  }

  static style = {
    page: {
      flex: 1,
      // overflowY: 'scroll',
      // overflowX: 'visible',
      overflow: 'visible',
    },
  }
}
