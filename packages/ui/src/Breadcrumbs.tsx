import { createStoreContext, ensure, react, useReaction } from '@o/use-store'
import { ObservableSet } from 'mobx'
import React, { ReactNode, useEffect, useRef } from 'react'

import { Text, TextProps } from './text/Text'
import { Omit } from './types'

export type BreadcrumbsProps = {
  separator?: ReactNode
  children?: ReactNode | ((crumb?: ReturnType<typeof useBreadcrumb>) => ReactNode)
}

class BreadcrumbStore {
  props: {
    separator: BreadcrumbsProps['separator']
  }

  selectors = new ObservableSet<string>()

  orderedChildren = react(
    () => [...this.selectors],
    selectors => {
      ensure('selectors', !!selectors.length)
      const nodes = Array.from(document.querySelectorAll(selectors.map(x => `.${x}`).join(', ')))
      const orderedSelectors = nodes.map(node =>
        selectors.find(sel => node.classList.contains(sel)),
      )
      return orderedSelectors
    },
    {
      defaultValue: [],
      log: false,
    },
  )

  mount(node: string) {
    this.selectors.add(node)
  }
  unmount(node: string) {
    this.selectors.delete(node)
  }
}

const BContext = createStoreContext(BreadcrumbStore)

export function Breadcrumbs({ separator, children }: BreadcrumbsProps) {
  const store = BContext.useCreateStore({ separator }, { react: false })
  return <BContext.SimpleProvider value={store}>{children}</BContext.SimpleProvider>
}

export function Breadcrumb({
  separator = <Text>{' >'}</Text>,
  children,
  ...props
}: Omit<TextProps, 'children'> & BreadcrumbsProps) {
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
      <Text {...props} className={`${(crumb && crumb.selector) || ''} ${props.className || ''}`}>
        {children}
      </Text>
      {crumb && crumb.isLast ? '' : separator}
    </BreadcrumbReset>
  )
}

// recommended to use below each breadcrumb to avoid accidental nesting
export function BreadcrumbReset(props: { children: any }) {
  return <BContext.SimpleProvider value={null}>{props.children}</BContext.SimpleProvider>
}

export type BreadcrumbInfo = {
  index: number
  total: number
  isFirst: boolean
  isLast: boolean
  selector: string
}

const opts = {
  name: 'Breadcrumbs',
}

export function useBreadcrumb(): BreadcrumbInfo | null {
  const selector = useRef(`crumb-${Math.random()}`.replace('.', '')).current
  const crumbs = BContext.useStore()

  useEffect(() => {
    if (!crumbs) return
    crumbs.mount(selector)
    return () => {
      crumbs.unmount(selector)
    }
  }, [])

  const index = useReaction(() => {
    ensure('crumbs', !!crumbs)
    return crumbs.orderedChildren.findIndex(x => x === selector)
  }, opts)

  if (!crumbs) {
    return null
  }

  const total = crumbs.orderedChildren.length
  const isLast = index === total - 1
  const isFirst = index === 0

  return { selector, index, total, isLast, isFirst }
}
