import { App, AppViewProps, createApp, getAppDefinition, useAppBit } from '@o/kit'
import { CenteredText, Circle, List, ListItemProps, memoizeWeak, Section } from '@o/ui'
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
      const { id, identifier, name, items = [] } = om.state.share[key]
      return {
        id: key,
        title: name,
        subTitle: items.length
          ? `Selected: ${items
              .filter(x => !!x)
              .map(i => i.title.slice(0, 20))
              .slice(0, 2)
              .join(', ')}${items.length > 2 ? '...' : ''}`
          : 'Nothing selected',
        icon: getAppDefinition(identifier).icon,
        after: <Circle>{items.length}</Circle>,
        extraProps: {
          subId: id,
        },
      }
    })
  return (
    <List
      selectable
      itemProps={{
        small: true,
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
