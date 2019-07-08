import { App, createApp } from '@o/kit'
import { List } from '@o/ui'
import React from 'react'

import { useOm } from '../om/om'

export default createApp({
  id: 'clipboard',
  name: 'Clipboard',
  icon: 'clipboard',
  app: props => (
    <App index={<ShareAppIndex />}>
      <div>no main</div>
    </App>
  ),
})

const ShareAppIndex = () => {
  const om = useOm()
  const items = Object.keys(om.state.share).flatMap(id => {
    return om.state.share[id].map(i => ({
      ...i,
      groupName: id,
    }))
  })
  return (
    <List
      selectable="multi"
      itemProps={{ small: true }}
      items={items ? listItemNiceNormalize(items) : null}
    />
  )
}

const subTitleAttrs = ['subTitle', 'subtitle', 'email', 'address', 'phone', 'type', 'account']
const titleAttrs = ['title', 'name', 'email', ...subTitleAttrs]
const findAttr = (attrs, row, avoid = '') => {
  for (const attr of attrs) {
    if (typeof row[attr] === 'string' && row[attr] !== avoid) {
      return row[attr]
    }
  }
}

function listItemNiceNormalize(rows: any[]) {
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
}
