import React, { Component } from 'react'

import { createBanner } from './Banner'
import { Button } from './buttons/Button'

export class ErrorBoundary extends Component<{ name: string; displayInline?: boolean }> {
  state = {
    error: null,
  }

  handle = createBanner()

  componentDidCatch(error) {
    console.warn('ErrorBoundary caught error', this.props.name)
    console.log(error.stack)
    this.handle.set({
      type: 'error',
      title: `Error in ${this.props.name}`,
      message: `${error.message}`,
    })
    this.setState({ error })
  }

  render() {
    if (this.state.error) {
      return (
        <Button
          tooltip="Clear error and retry"
          alt="warn"
          margin="auto"
          onClick={() => this.setState({ error: null })}
        >
          Retry
        </Button>
      )
    }
    return this.props.children
  }
}
