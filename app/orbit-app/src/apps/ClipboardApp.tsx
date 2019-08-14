import { App, AppIcon, AppViewProps, createApp, useAppBit } from '@o/kit'
import { CenteredText, Circle, isDefined, List, ListItemProps, memoizeWeak, pluralize, Section } from '@o/ui'
import React, { memo } from 'react'

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

const summarize = (items: any[]) => {
  const i0 = items[0]
  if (isDefined(i0.title, i0.name)) {
    return `${items
      .filter(x => !!x)
      .map(i => (i.title || i.name || '').slice(0, 20))
      .slice(0, 2)
      .join(', ')}${items.length > 2 ? '...' : ''}`
  }
  return `${items.length} ${pluralize(items.length, 'item')}`
}

const ClipboardAppIndex = memo(() => {
  const om = useOm()
  const items: ListItemProps[] = Object.keys(om.state.share)
    // .map(x => om.state.share[x])
    // dont show dock apps in clipboard
    .filter(x => {
      const shareItem = om.state.share[x]
      return shareItem && om.state.apps.activeDockApps.some(app => shareItem.id === app.id) !== true
    })
    .map(key => {
      const { id, name, items = [] } = om.state.share[key]
      const app = om.state.apps.activeApps.find(x => x.id === id)
      const subTitle = items.length ? `Selected: ${summarize(items)}` : 'Nothing selected'
      return {
        id: key,
        title: name,
        subTitle,
        icon: <AppIcon app={app} />,
        iconBefore: true,
        after: <Circle>{items.length}</Circle>,
        draggableItem: items,
        extraProps: {
          subId: id,
        },
      }
    })
  return (
    <List
      alwaysSelected
      selectable
      itemProps={{
        draggable: true,
      }}
      items={items ? listItemNiceNormalize(items) : null}
    />
  )
})

const ClipboardAppMain = memo((props: AppViewProps) => {
  const om = useOm()
  const shareItem = om.state.share[props.id!]
  const [app] = useAppBit(shareItem && shareItem.id)

  if (!shareItem || !app) {
    return <CenteredText>No item found.</CenteredText>
  }

  const { items } = shareItem

  return (
    <Section title={`Clipboard: ${app.name}`} titleBorder padding space flex={1}>
      <List
        flex={1}
        itemProps={{
          iconBefore: true,
          draggable: true,
        }}
        selectable="multi"
        items={items ? listItemNiceNormalize(items) : null}
      />
    </Section>
  )
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
