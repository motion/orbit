import { createStoreContext, ensure, react } from '@o/use-store'
import { selectDefined } from '@o/utils'
import { ObservableSet } from 'mobx'
import React, { ReactNode, useLayoutEffect, useRef } from 'react'

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

  return (
    <BreadcrumbReset>
      <Text
        {...props}
        opacity={crumb && crumb.total === 0 ? 0 : selectDefined(props.opacity, 1)}
        className={`${(crumb && crumb.selector) || ''} ${props.className || ''}`}
      >
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

export function useBreadcrumb(): BreadcrumbInfo | null {
  const selector = useRef(`crumb-${Math.random()}`.replace('.', '')).current
  const crumbStore = BContext.useStore()
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

  return { selector, index, total, isLast, isFirst }
}
