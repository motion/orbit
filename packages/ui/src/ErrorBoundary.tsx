import React, { Component } from 'react'

import { Button } from './buttons/Button'
import { Section } from './Section'

export class ErrorBoundary extends Component<{ name: string }> {
  state = {
    error: null,
  }

  componentDidCatch(error) {
    console.warn('ErrorBoundary caught error', this.props.name)
    this.setState({
      error: {
        message: error.message,
        stack: error.stack,
      },
    })
  }

  render() {
    const { error } = this.state
    if (error) {
      return (
        <Section
          background="darkorange"
          color="white"
          title={error.message || 'Error'}
          subTitle={this.props.name}
          flex={1}
          minWidth={200}
          minHeight={200}
          scrollable="y"
          whiteSpace="pre-line"
          pad
        >
          <Button alt="confirm" onClick={() => this.setState({ error: null })}>
            Clear
          </Button>
          <pre>{error.stack}</pre>
        </Section>
      )
    }
    return this.props.children
  }
}
