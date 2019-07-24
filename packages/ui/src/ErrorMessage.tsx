import React from 'react'

import { Section } from './Section'
import { SubTitle } from './text/SubTitle'

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
          <SubTitle>{message}</SubTitle>
          {!!stack && <pre>{stack}</pre>}
        </Section>
      )}
    </ComponentStack>
  )
}

type ComponentStackProps = {
  children?: (stack: string) => React.ReactNode
}

class ComponentStack extends React.Component<ComponentStackProps> {
  state = {
    info: '',
  }
  componentDidCatch(_, info) {
    this.setState({ info: `${info.componentStack}` })
  }
  render() {
    if (!this.state.info) {
      return <ThrowComponent />
    }
    return this.props.children(this.state.info)
  }
}

const ThrowComponent = () => {
  throw new Error('')
  return null
}
