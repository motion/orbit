import * as React from 'react'

export default class PassProps extends React.Component {
  render() {
    const { children, containerProps, ...props } = this.props

    const getChild = child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, props)
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
