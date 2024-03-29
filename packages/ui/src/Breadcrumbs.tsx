import { createStoreContext, ensure, react } from '@o/use-store'
import { selectDefined } from '@o/utils'
import { ObservableSet } from 'mobx'
import React, { ReactNode, useContext, useLayoutEffect, useRef } from 'react'

import { Text, TextProps } from './text/Text'

export type BreadcrumbsProps = {
  separator?: ReactNode
  children: ReactNode | ((crumb?: ReturnType<typeof useBreadcrumb>) => ReactNode)
}

class BreadcrumbStore {
  props: {
    separator?: BreadcrumbsProps['separator']
    id?: string
  }

  selectors = new ObservableSet<string>()

  orderedChildren = react(
    () => [...this.selectors],
    async (selectors, { sleep }) => {
      // sleep prevents cascading updates on mounts...
      await sleep(30)
      ensure('selectors', !!selectors.length)
      const nodes = Array.from(document.querySelectorAll(selectors.map(x => `.${x}`).join(', ')))
      if (nodes.length) {
        const orderedSelectors = nodes.map(node =>
          selectors.find(sel => node.classList.contains(sel)),
        )
        return orderedSelectors
      } else {
        // fall back in case to still show something
        return [...selectors]
      }
    },
    {
      defaultValue: [],
    },
  )

  mount(node: string) {
    this.selectors.add(node)
  }

  unmount(node: string) {
    this.selectors.delete(node)
  }
}

const BreadcrumbStoreContext = createStoreContext(BreadcrumbStore)

export function Breadcrumbs(props: BreadcrumbsProps) {
  return <BreadcrumbStoreContext.Provider id={useRef(`${Math.random()}`).current} {...props} />
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

  return useBreadcrumbReset(
    <>
      <Text
        {...props}
        opacity={crumb && crumb.total === 0 ? 0 : selectDefined(props.opacity, 1)}
        className={`${(crumb && crumb.selector) || ''} ${props.className || ''}`}
      >
        {children}
      </Text>
      {crumb && crumb.isLast ? '' : separator}
    </>,
  )
}

// recommended to use below each breadcrumb to avoid accidental nesting
export function BreadcrumbReset(props: { children: any }) {
  return useBreadcrumbReset(props.children)
}

export const useBreadcrumbReset = (children: any) => {
  const hasContext = !!useContext(BreadcrumbStoreContext.Context)
  if (hasContext) {
    return (
      <BreadcrumbStoreContext.ProvideStore value={null}>
        {children}
      </BreadcrumbStoreContext.ProvideStore>
    )
  }
  return children
}

export type BreadcrumbInfo = {
  index: number
  total: number
  isFirst: boolean
  isLast: boolean
  selector: string
  crumbStore: BreadcrumbStore
}

export function useBreadcrumb(): BreadcrumbInfo | null {
  const selector = useRef(`crumb-${Math.random()}`.replace('.', '')).current
  const crumbStore = BreadcrumbStoreContext.useStore()
  const index = crumbStore ? crumbStore.orderedChildren.findIndex(x => x === selector) : -1

  useLayoutEffect(() => {
    if (!crumbStore) return
    crumbStore.mount(selector)
    return () => {
      crumbStore.unmount(selector)
    }
  }, [])

  if (!crumbStore) {
    return null
  }

  const total = crumbStore.selectors.size
  const isLast = index === total - 1
  const isFirst = index === 0

  return { selector, index, total, isLast, isFirst, crumbStore }
}
