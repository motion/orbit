import React from 'react'
import { view, HotKeys } from '@mcro/black'
import Redbox from 'redbox-react'
import RootStore from './rootStore'

@view.provide({
  rootStore: RootStore,
})
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

  unstable_handleError(error) {
    this.setState({ error })
    console.error('ERR', error)
  }

  clearErrors() {
    this.setState({ error: null })
  }

  render({ rootStore }) {
    if (this.state.error) {
      return <Redbox $$draggable error={this.state.error} />
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
