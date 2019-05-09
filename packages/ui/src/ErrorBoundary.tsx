import React, { Component } from 'react'

import { Button } from './buttons/Button'
import { Center } from './Center'
import { FloatingChrome } from './helpers/FloatingChrome'
import { useNode } from './hooks/useNode'
import { Section } from './Section'
import { SubTitle } from './text/SubTitle'
import { Col } from './View/Col'

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
      if (process.env.NODE_ENV === 'development') {
        return <ErrorMessage error={error} name={this.props.name} />
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

function ErrorMessage({ error, name }) {
  const { ref } = useNode({ map: x => x.parentElement })
  return (
    <>
      <FloatingChrome target={ref}>
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
          pad
        >
          <Button alt="confirm" onClick={() => this.setState({ error: null })}>
            Clear
          </Button>
          <pre>{error.stack}</pre>
        </Section>
      </FloatingChrome>
    </>
  )
}
