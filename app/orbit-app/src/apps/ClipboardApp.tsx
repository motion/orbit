import { App, AppProps, createApp, getAppDefinition } from '@o/kit'
import { Circle, List, ListItemProps, memoizeWeak } from '@o/ui'
import React, { memo, useMemo } from 'react'

import { useOm } from '../om/om'

export default createApp({
  id: 'clipboard',
  name: 'Clipboard',
  icon: 'clipboard',
  app: props => (
    <App index={<ClipboardAppIndex />}>
      <ClipboardAppMain {...props} />
    </App>
  ),
})

const ClipboardAppIndex = memo(() => {
  const om = useOm()
  const items: ListItemProps[] = Object.keys(om.state.share)
    .map(key => {
      if (!om.state.share[key]) {
        return null
      }
      const { id, identifier, name, items } = om.state.share[key]
      return {
        title: name,
        subTitle: `${(items || [])
          .filter(x => !!x)
          .map(i => i.title.slice(0, 20))
          .slice(0, 2)
          .join(', ')}${items.length > 2 ? '...' : ''}`,
        icon: getAppDefinition(identifier).icon,
        after: <Circle>{items.length}</Circle>,
        extraData: {
          subType: id,
        },
      }
    })
    .filter(Boolean)
  return (
    <List
      selectable
      itemProps={{ small: true }}
      items={items ? listItemNiceNormalize(items) : null}
    />
  )
})

const ClipboardAppMain = memo((props: AppProps) => {
  return <div>{JSON.stringify(props)}</div>
})

const subTitleAttrs = ['subTitle', 'subtitle', 'email', 'address', 'phone', 'type', 'account']
const titleAttrs = ['title', 'name', 'email', ...subTitleAttrs]
const findAttr = (attrs, row, avoid = '') => {
  for (const attr of attrs) {
    if (typeof row[attr] === 'string' && row[attr] !== avoid) {
      return row[attr]
    }
  }
}

const listItemNiceNormalize = memoizeWeak((rows: any[]) => {
  if (!rows.length) return rows
  if (!rows[0]) return []
  if (rows[0].title) return rows
  return rows.map(rawRow => {
    const row = rawRow.values || rawRow
    const id = row.id || row.key || row.uid
    const title = findAttr(titleAttrs, row) || 'No Title'
    const subTitle = findAttr(titleAttrs, row, title)
    return {
      id,
      title,
      subTitle: subTitle && id ? `${id} ${subTitle}` : subTitle,
    }
  })
})
