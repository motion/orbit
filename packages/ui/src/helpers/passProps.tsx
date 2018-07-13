import * as React from 'react'

export class PassProps extends React.Component {
  render() {
    const { children, ...props } = this.props
    const getChild = child => {
      if (!child || typeof child === 'string') {
        return child
      }
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...props,
          ...child.props,
        })
      }
      const Child = child
      return <Child {...props} />
    }
    if (!React.Children.count(children)) {
      return getChild(children)
    }
    return React.Children.map(children, getChild)
  }
}
