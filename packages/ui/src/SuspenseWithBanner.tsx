import { Suspense, useEffect } from 'react'
import React from 'react'

import { useBanner } from './Banner'
import { Center } from './Center'
import { Loading, LoadingProps } from './progress/Loading'
import { SubTitle } from './text/SubTitle'

type SuspenseProps = LoadingProps & {
  children?: React.ReactNode
  fallback?: NonNullable<React.ReactNode> | null
}

export class SuspenseWithBanner extends React.Component<SuspenseProps, { error: string }> {
  state = {
    error: null,
  }

  clearError = () => {
    if (this.state.error) {
      this.setState({ error: null })
    }
  }

  componentDidCatch(error) {
    console.warn('catching error', error)
    this.setState({ error: `${error.message}\n${error.stack}` })
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorHandler error={this.state.error} onClose={this.clearError}>
          <Center>
            <SubTitle>Error loading content</SubTitle>
          </Center>
        </ErrorHandler>
      )
    }

    return (
      <Suspense fallback={<Loading message={this.props.message} />}>{this.props.children}</Suspense>
    )
  }
}

function ErrorHandler(props: { error: string; children: any; onClose: () => void }) {
  const banner = useBanner()

  useEffect(() => {
    banner.set({
      type: 'error',
      message: `${props.error}`,
      onClose: props.onClose,
    })
  }, [props.error])

  return props.children || null
}
