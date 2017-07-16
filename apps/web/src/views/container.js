import React from 'react'
import { view } from '@mcro/black'
import Redbox from 'redbox-react'

export default class Container extends React.Component {
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

  render() {
    if (this.state.error) {
      return <Redbox $$draggable error={this.state.error} />
    }
    return this.props.children
  }
}
