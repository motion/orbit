import React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { CurrentUser } from '~/app'

const service = (window.location + '').split('service=')[1]
@view({
  store: class SettingsStore {
    link = async service => {
      const clearId = setInterval(async () => {
        if (CurrentUser.user) {
          clearInterval(clearId)
          await CurrentUser.link(service)
          // setTimeout(() => {
          //   window.close()
          // }, 100)
        }
      }, 200)
    }
  },
})
export default class SettingsPage {
  componentWillMount() {
    //this.props.store.link(service)
  }

  render({ store }) {
    return (
      <h5 css={{ padding: 30 }}>
        loading {service} integration{' '}
        <button onClick={() => store.link(service)}>link</button>
      </h5>
    )
  }

  static style = {}
}
