import { Row, ViewProps } from '@o/gloss'
import { useReaction, useStore } from '@o/use-store'
import { ObservableSet } from 'mobx'
import React, { createContext, ReactNode, useContext, useEffect, useRef } from 'react'
import { MergeContext } from './helpers/MergeContext'
import { Text } from './text/Text'

const Context = createContext<BreadcrumbStore | null>(null)

class BreadcrumbStore {
  children = new ObservableSet<number>()
  mount(id: number) {
    this.children.add(id)
  }
  unmount(id: number) {
    this.children.delete(id)
  }
}

export function Breadcrumbs(props: ViewProps) {
  const store = useStore(BreadcrumbStore)
  console.log('store', store)
  return (
    <MergeContext Context={Context} value={store}>
      <Row alignItems="center" {...props} />
    </MergeContext>
  )
}

export type BreadcrumbsProps = {
  separator?: ReactNode
  children?: ReactNode | ((crumb?: ReturnType<typeof useBreadcrumb>) => ReactNode)
}

export function Breadcrumb({
  separator = <Text>{' >'}</Text>,
  children,
  ...props
}: BreadcrumbsProps) {
  const crumb = useBreadcrumb()

  if (typeof children === 'function') {
    return children(crumb)
  }

  // wait for all items to be mounted to render them
  if (crumb && crumb.total === 0) {
    return null
  }

  return (
    <BreadcrumbReset>
      <Text {...props}>{children}</Text>
      {crumb && crumb.isLast ? '' : separator}
    </BreadcrumbReset>
  )
}

// recommended to use below each breadcrumb to avoid accidental nesting
export function BreadcrumbReset(props: { children: any }) {
  return <Context.Provider value={null}>{props.children}</Context.Provider>
}

export type BreadcrumbInfo = {
  index: number
  total: number
  isFirst: boolean
  isLast: boolean
}

export function useBreadcrumb(): BreadcrumbInfo | null {
  const idRef = useRef(Math.random())
  const id = idRef.current
  const context = useContext(Context)

  useEffect(
    () => {
      if (!context) return
      context.mount(id)
      return () => context.unmount(id)
    },
    [context],
  )

  if (!context) {
    return null
  }

  const children = useReaction(() => [...context.children], { delay: 16, defaultValue: [] })
  const total = children.length
  const index = children.indexOf(id)
  const isLast = index === total - 1
  const isFirst = index === 0

  return { index, total, isLast, isFirst }
}
