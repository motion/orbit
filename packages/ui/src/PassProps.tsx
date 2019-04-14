import React, { Children, cloneElement, isValidElement } from 'react'

export type PassPropsProps = {
  passCondition?: (child: any) => boolean
  getChildProps?: (child: any, index: number) => any
  [key: string]: any
}

const getChild = (child: any, props: PassPropsProps) => {
  if (!child || typeof child === 'string') {
    return child
  }
  if (isValidElement(child)) {
    // allows conditional passsing of props
    if (props.passCondition) {
      if (props.passCondition(child) === false) {
        return child
      }
    }
    return cloneElement(child, {
      ...props,
      ...child.props,
    })
  }
  const Child = child
  return <Child {...props} />
}

export function PassProps({ children, getChildProps, ...props }: PassPropsProps) {
  return (
    <>
      {Children.map(children, (child, index) =>
        getChild(child, { ...props, ...(getChildProps && getChildProps(child, index)) }),
      )}
    </>
  )
}
