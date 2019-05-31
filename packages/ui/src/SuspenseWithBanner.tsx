import { Suspense, useEffect } from 'react'
import React from 'react'

import { useBanner } from './Banner'
import { Loading } from './progress/Loading'

interface SuspenseProps {
  children?: React.ReactNode
  fallback: NonNullable<React.ReactNode> | null
}

export class SuspenseWithBanner extends React.Component<SuspenseProps> {
  state = {
    error: null,
  }

  componentDidCatch(error) {
    console.warn('catching error', error)
    this.setState({ error })
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorHandler error={this.state.error} onClose={() => this.setState({ error: null })}>
          <Loading />
        </ErrorHandler>
      )
    }

    return <Suspense fallback={<Loading />}>{this.props.children}</Suspense>
  }
}

function ErrorHandler(props: { error: string; children: any; onClose: () => void }) {
  const banner = useBanner()

  useEffect(() => {
    banner.show({
      message: props.error,
      onClose: props.onClose,
    })
  }, [props.error])

  return props.children || null
}
