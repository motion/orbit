import { Row, RowProps } from '@o/gloss'
import { ensure, react, useReaction, useStore } from '@o/use-store'
import { ObservableSet } from 'mobx'
import React, { createContext, ReactNode, useContext, useEffect, useRef } from 'react'
import { MergeContext } from './helpers/MergeContext'
import { Text, TextProps } from './text/Text'
import { Omit } from './types'

const Context = createContext<BreadcrumbStore | null>(null)

export type BreadcrumbsProps = Omit<RowProps, 'children'> & {
  separator?: ReactNode
  children?: ReactNode | ((crumb?: ReturnType<typeof useBreadcrumb>) => ReactNode)
}

class BreadcrumbStore {
  props: {
    // TODO this isnt passing down
    separator: BreadcrumbsProps['separator']
  }
  selectors = new ObservableSet<string>()

  orderedChildren = react(
    () => [...this.selectors],
    async (selectors, { sleep }) => {
      ensure('selectors', !!selectors.length)
      await sleep()
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

export function Breadcrumbs({ separator, ...props }: BreadcrumbsProps) {
  const store = useStore(BreadcrumbStore, { separator })
  return (
    <MergeContext Context={Context} value={store}>
      <Row alignItems="center" {...props} />
    </MergeContext>
  )
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
  return <Context.Provider value={null}>{props.children}</Context.Provider>
}

export type BreadcrumbInfo = {
  index: number
  total: number
  isFirst: boolean
  isLast: boolean
  selector: string
}

export function useBreadcrumb(): BreadcrumbInfo | null {
  const selector = useRef(`crumb-${Math.random()}`.replace('.', '')).current
  const context = useContext(Context)

  useEffect(() => {
    if (!context) return
    context.mount(selector)
    return () => {
      context.unmount(selector)
    }
  }, [])

  const index = useReaction(() =>
    context ? context.orderedChildren.findIndex(x => x === selector) : -1,
  )

  if (!context) {
    return null
  }

  const total = context.orderedChildren.length
  const isLast = index === total - 1
  const isFirst = index === 0

  return { selector, index, total, isLast, isFirst }
}
