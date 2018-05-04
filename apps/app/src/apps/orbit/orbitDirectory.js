import * as React from 'react'
import { view, react } from '@mcro/black'
// import * as UI from '@mcro/ui'
import { Person } from '@mcro/models'
import OrbitDockedPane from './orbitDockedPane'

class OrbitDirectoryStore {
  @react({ immediate: true })
  setGetResults = [
    () => this.props.paneStore.activePane === this.props.name,
    isActive => {
      if (!isActive) throw react.cancel
      this.props.appStore.setGetResults(() => this.results)
    },
  ]

  @react({
    defaultValue: [],
  })
  results = async () => {
    return await Person.find({ take: 30 })
  }
}

@view({
  store: OrbitDirectoryStore,
})
export default class OrbitDirectory {
  render() {
    return <OrbitDockedPane name="directory">directory</OrbitDockedPane>
  }
}
