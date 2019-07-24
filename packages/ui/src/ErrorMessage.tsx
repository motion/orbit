import React from 'react'

import { Section } from './Section'
import { CenteredText } from './text/CenteredText'

export type ErrorMessageProps = {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <ComponentStack>
      {stack => (
        <Section
          flex={1}
          minWidth="100%"
          minHeight="100%"
          scrollable="y"
          whiteSpace="pre-line"
          pointerEvents="inherit"
          padding
        >
          <CenteredText>{message}</CenteredText>
          {!!stack && <pre>{stack}</pre>}
        </Section>
      )}
    </ComponentStack>
  )
}

type ComponentStackProps = {
  children?: (props: { error: string }) => React.ReactNode
}

class ComponentStack extends React.Component<ComponentStackProps> {
  state = {
    error: null,
  }
  componentDidCatch(error) {
    this.setState({ error })
  }
  componentDidMount() {
    if (!this.state.error) {
      return <ThrowComponent />
    }
    return this.props.children(this.state)
  }
}

const ThrowComponent = () => {
  throw new Error('')
  return null
}
