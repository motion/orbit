import React, { Children, cloneElement, isValidElement } from 'react'

export type PassPropsProps = {
  passCondition?: (child: any, index: number) => boolean
  getChildProps?: (child: any, index: number) => any
  [key: string]: any
}

export const PassProps = ({ children, getChildProps, passCondition, ...props }: PassPropsProps) => {
  return (
    <>
      {Children.map(children, (child, index) => {
        if (passCondition && passCondition(child, index) === false) {
          return null
        }
        return getChild(child, { ...props, ...(getChildProps && getChildProps(child, index)) })
      })}
    </>
  )
}

PassProps.canUnwrap = true

function getChild(child: any, props: PassPropsProps) {
  if (!child || typeof child === 'string') {
    return child
  }
  if (isValidElement(child)) {
    return cloneElement(child, {
      ...props,
      ...(child.props as any),
    })
  }
  const Child = child
  return <Child {...props} />
}
