import React from 'react'

export default class PassProps extends React.Component {
  render() {
    const { children, containerProps, ...props } = this.props

    const childrenLength = React.Children.count(children)

    if (!childrenLength) {
      if (React.isValidElement(children)) {
        return React.cloneElement(children, props)
      }
      const Child = children
      return <Child {...props} />
    }

    return (
      <passprops
        style={{
          flexOrder: 'inherit',
          flexBasis: 'inherit',
          flexDirection: 'inherit',
          flexFlow: 'inherit',
        }}
        {...containerProps}
      >
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, props)
          }
          const Child = child
          return <Child {...props} />
        })}
      </passprops>
    )
  }
}
