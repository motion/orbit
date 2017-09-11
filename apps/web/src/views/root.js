import React from 'react'
import { view } from '@mcro/black'
import { HotKeys } from '~/helpers'
import Redbox from 'redbox-react'
import RootStore from '~/stores/rootStore'

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
