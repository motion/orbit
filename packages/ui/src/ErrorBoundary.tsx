import React, { Component } from 'react'

import { Button } from './buttons/Button'
import { Center } from './Center'
import { FloatingChrome } from './helpers/FloatingChrome'
import { useNode } from './hooks/useNode'
import { Section } from './Section'
import { SubTitle } from './text/SubTitle'
import { Col } from './View/Col'

export class ErrorBoundary extends Component<{ name: string; displayInline?: boolean }> {
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
      if (process.env.NODE_ENV === 'development') {
        return (
          <ErrorMessage
            displayInline={this.props.displayInline}
            setError={this.setState.bind(this)}
            error={error}
            name={this.props.name}
          />
        )
      } else {
        // more subtle in prod
        return (
          <Col flex={1} position="relative">
            <Center>
              <SubTitle>On no! An error occured.</SubTitle>
            </Center>
          </Col>
        )
      }
    }
    return this.props.children
  }
}

function ErrorMessage({ error, name, setError, displayInline }) {
  const { ref } = useNode({ map: x => x.parentElement })
  const content = (
    <Section
      ref={ref}
      background="darkorange"
      color="white"
      title={`${name}: ${error.message || 'Error'}`}
      flex={1}
      minWidth={200}
      minHeight={200}
      scrollable="y"
      whiteSpace="pre-line"
      pointerEvents="inherit"
      padding
    >
      <Button alt="confirm" onClick={() => setError({ error: null })}>
        Clear
      </Button>
      <pre>{error.stack}</pre>
    </Section>
  )
  if (displayInline) {
    return content
  }
  return <FloatingChrome target={ref}>{content}</FloatingChrome>
}
