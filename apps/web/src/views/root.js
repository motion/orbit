import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from '~/helpers'
import Redbox from 'redbox-react'
import RootStore from '~/stores/rootStore'
import * as UI from '@mcro/ui'

@view.provide({
  rootStore: RootStore,
})
@view
export default class Root extends React.Component {
  state = {
    error: null,
  }

  clearErr = () => {
    this.setState({ error: null })
  }

  componentDidMount() {
    view.on('hmr', this.clearErr)
  }

  componentWillUnmount() {
    view.off('hmr', this.clearErr)
  }

  componentDidCatch(error) {
    console.error('React.handleError', error)
    this.setState({ error })
  }

  clearErrors() {
    this.setState({ error: null })
  }

  clearHmr = async () => {
    await window.start()
    view.emit('hmr')
  }

  render({ rootStore }) {
    if (this.state.error) {
      return (
        <aboveredbox>
          <UI.Button onClick={this.clearHmr}>Refresh</UI.Button>
          <Redbox $$draggable error={this.state.error} />
        </aboveredbox>
      )
    }
    return (
      <HotKeys keyMap={rootStore.shortcuts}>
        <HotKeys attach={window} focused handlers={rootStore.actions}>
          {this.props.children}
        </HotKeys>
      </HotKeys>
    )
  }
}
