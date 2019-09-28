import React, { Children, cloneElement, createContext, isValidElement, memo, ReactElement, useMemo } from 'react'

import { useParentNodeSize } from '../hooks/useParentNodeSize'
import { Stack, StackProps } from '../View/Stack'
import { View } from '../View/View'
import { useVisibility } from '../Visibility'

export type LayoutProps = StackProps & {
  type?: 'column' | 'row'
  children?: React.ReactNode
}

export const LayoutContext = createContext<{
  total: number
  flexes: number[]
  type: LayoutProps['type']
}>({
  total: 0,
  flexes: [],
  type: 'row',
})

export const acceptsProps = (child, key) =>
  !!(child && child.type && child.type.acceptsProps && child.type.acceptsProps[key])

export const Layout = memo((props: LayoutProps) => {
  const children: ReactElement[] = Children.map(props.children, child => {
    if (!isValidElement(child) || !acceptsProps(child, 'paneProps')) {
      console.warn(
        `Invalid child: <Layout /> accepts only <Pane /> as children. You can fix this by adding Component.acceptsProps = { paneProps: true } and passing the pane props down to child <Pane />.`,
        child,
        props,
      )
      return null
    }
    return child
  }).filter(Boolean)
  const visibility = useVisibility()
  const total = children.length
  const flexes = children.map(child => child.props.flex || 1)
  const memoValue = useMemo(() => ({ type: props.type, total, flexes }), [
    props.type,
    total,
    JSON.stringify(flexes),
  ])
  const { ref, height, width } = useParentNodeSize({
    disable: !visibility,
    throttle: 200,
  })

  return (
    <View
      nodeRef={ref}
      data-is="Layout"
      flex={1}
      overflow="hidden"
      height="100%"
      width="100%"
      style={{
        maxHeight: height === 0 ? 'auto' : height,
        maxWidth: width === 0 ? 'auto' : width,
      }}
    >
      <LayoutContext.Provider value={memoValue}>
        <FlexLayout {...props} />
      </LayoutContext.Provider>
    </View>
  )
})

const FlexLayout = memo(({ children, type, ...colProps }: LayoutProps) => {
  const visibility = useVisibility()
  const { ref, ...size } = useParentNodeSize({
    disable: !visibility,
    throttle: 200,
  })
  const dimension = type === 'row' ? 'width' : 'height'
  const parentSize = size[dimension]
  const validChildren = Children.toArray(children).filter(child => !!child)
  const total = validChildren.length
  const childElements = validChildren.map((child, index) => {
    return cloneElement(child as any, {
      index,
      total,
      parentSize,
    })
  })

  // only flex once we measure
  // const flex = parentSize ? 1 : 'inherit'

  if (type === 'row') {
    return (
      <Stack
        data-is="LayoutRow"
        direction="horizontal"
        flex={1}
        minHeight={size.height || 'auto'}
        maxHeight={size.height || '100%'}
        overflow="hidden"
        nodeRef={ref}
        {...colProps}
      >
        {childElements}
      </Stack>
    )
  }

  return (
    <Stack
      data-is="LayoutCol"
      flex={1}
      minHeight={size.height || 'auto'}
      maxHeight={size.height || '100%'}
      overflow="hidden"
      nodeRef={ref}
      {...colProps}
    >
      {childElements}
    </Stack>
  )
})
