import { ListItem, Separator, View } from '@o/ui'
import { flatten } from 'lodash'
import React, { memo, useContext } from 'react'
import { useActiveApps } from '../hooks/useActiveApps'
import { OrbitListItemProps } from './ListItem'
import { SearchItemShareContext } from './SearchItemProvide'

export const ShareMenu = memo(function ShareMenu() {
  const itemAction = useContext(SearchItemShareContext)
  const listApps = useActiveApps('lists')

  console.warn(
    'need to make this work generically to share between apps now, before was hardcoded to ListsApp',
  )

  return (
    <View overflowX="hidden" overflowY="auto" flex={1}>
      <Separator paddingTop={10}>Send to...</Separator>
      {flatten(
        listApps.map(app => {
          let items: OrbitListItemProps[] = [
            {
              id: `app-${app.id}`,
              title: app.name,
              icon: `orbit-${app.identifier}`,
              subtitle: `Parent list...`,
              onClick: () => {
                console.log('sending to list', app, itemAction)
                // !TODO
                // ListsApp.api.receive(app as any, listRootID, itemAction.item)
              },
            },
          ]
          for (const id in app.data.items) {
            const folder = app.data.items[id]
            if (folder.type === 'folder') {
              items.push({
                id: `folder-${folder.id}`,
                title: folder.name,
                icon: folder.icon || 'folder',
                subtitle: null,
                marginLeft: 10,
              })
            }
          }
          return items.map(({ id, ...item }) => <ListItem key={id} {...item} />)
        }),
      )}
    </View>
  )
})
