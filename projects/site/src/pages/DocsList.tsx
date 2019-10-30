import { List, ListItemProps, sleep, useFilter, useOnMount, whenIdle } from '@o/ui'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'

import { docsItems } from './docsItems'
import { docsNavigate, preloadItem } from './docsPageHelpers'
import { DocsStoreContext } from './DocsStore'

const itemProps = {
  hideBorder: true,
  titleProps: {
    fontSize: 13,
  },
  padding: [10, 12],
  iconProps: {
    opacity: 0.65,
  },
}

export const DocsList = memo((props: { shouldRenderAll?: boolean }) => {
  const docsStore = DocsStoreContext.useStore()
  const [mounted, setMounted] = useState(false)
  useOnMount(async () => {
    if (props.shouldRenderAll) {
      await sleep(1400) // wait for intro animation
      await whenIdle()
      await sleep(50)
      await whenIdle()
      await sleep(50)
      await whenIdle()
      await sleep(50)
      await whenIdle()
      setMounted(true)
    }
  })
  const curRow = useRef(docsItems[docsStore.section][0])
  const { results } = useFilter({
    query: docsStore.search,
    items: docsItems[docsStore.section],
  })
  const items = useMemo(() => {
    let items: ListItemProps[] = []
    if (docsStore.search) {
      items = [
        ...items,
        {
          key: docsStore.search,
          groupName: `Current Page`,
          ...curRow.current,
        },
        { separator: `Results for "${docsStore.search}"`, selectable: false },
      ]
    }
    items = [...items, ...results]
    return items
  }, [docsStore.search, results])
  return (
    <List
      selectable
      alwaysSelected
      defaultSelected={docsStore.search ? 0 : docsStore.initialIndex}
      overscanCount={mounted ? 500 : 0}
      items={items}
      itemProps={itemProps}
      getItemProps={preloadItem}
      onSelect={useCallback(rows => {
        if (!rows[0]) {
          console.warn('no row on select!', rows)
        } else {
          console.debug('nav to', rows[0].id)
          curRow.current = rows[0]
          docsNavigate(rows[0].id)
        }
      }, [])}
      {...props}
    />
  )
})
