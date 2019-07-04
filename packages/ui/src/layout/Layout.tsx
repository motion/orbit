import { gloss } from 'gloss'
import React, { Children, cloneElement, createContext, isValidElement, memo, ReactElement, useMemo } from 'react'

import { useParentNodeSize } from '../hooks/useParentNodeSize'
import { Col, ColProps } from '../View/Col'
import { Row } from '../View/Row'
import { View } from '../View/View'
import { useVisibility } from '../Visibility'

export type LayoutProps = ColProps & {
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
  !!(child.type.acceptsProps && child.type.acceptsProps[key])

export const Layout = memo((props: LayoutProps) => {
  const children: ReactElement[] = Children.map(props.children, child => {
    if (!isValidElement(child) || !acceptsProps(child, 'paneProps')) {
      console.warn(`Invalid child: <Layout /> accepts only <Pane /> as children.`, child, props)
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
      ref={ref}
      className="ui-layout"
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
  const total = Children.count(children)
  const dimension = type === 'row' ? 'width' : 'height'
  const parentSize = size[dimension]
  const childElements = Children.map(children, (child, index) => {
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
      <LayoutRow
        minHeight={size.height || 'auto'}
        maxHeight={size.height || '100%'}
        overflow="hidden"
        ref={ref}
        {...colProps}
      >
        {childElements}
      </LayoutRow>
    )
  }

  return (
    <LayoutCol
      minHeight={size.height || 'auto'}
      maxHeight={size.height || '100%'}
      overflow="hidden"
      ref={ref}
      {...colProps}
    >
      {childElements}
    </LayoutCol>
  )
})

const LayoutRow = gloss(Row, {
  flex: 1,
})

const LayoutCol = gloss(Col, {
  flex: 1,
})
