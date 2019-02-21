import { AppType, OrbitListItemProps, SearchItemShareContext } from '@mcro/kit'
import { ListItem, View } from '@mcro/ui'
import { flatten } from 'lodash'
import React, { memo, useContext } from 'react'
import { useActiveApps } from '../../hooks/useActiveApps'
import { Separator } from '../../views/Separator'
import { listRootID, ListsApp } from '../lists/ListsApp'

export default memo(function SearchItemShare() {
  const itemAction = useContext(SearchItemShareContext)
  const listApps = useActiveApps(AppType.lists)

  return (
    <View overflowX="hidden" overflowY="auto" flex={1}>
      <Separator paddingTop={10}>Send to...</Separator>
      {flatten(
        listApps.map(app => {
          let items: OrbitListItemProps[] = [
            {
              id: `app-${app.id}`,
              title: app.name,
              icon: `orbit-${app.type}`,
              subtitle: `Parent list...`,
              onClick: () => {
                console.log('sending to list', app, itemAction.item)
                // !TODO @umed type issue
                ListsApp.api.receive(app as any, listRootID, itemAction.item)
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
