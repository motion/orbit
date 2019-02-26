import { loadOne } from '@mcro/bridge'
import { OrbitListItemProps } from '@mcro/kit'
import { BitModel } from '@mcro/models'
import { Button } from '@mcro/ui'
import React from 'react'
import { ListAppDataItem } from './types'

export async function loadListItem(
  item?: ListAppDataItem,
  listId?: number,
): Promise<OrbitListItemProps> {
  if (!item) {
    console.warn('NO ITEM', item, listId)
    return null
  }
  switch (item.type) {
    case 'folder':
      return {
        title: item.name,
        subtitle: `${item.children.length} items`,
        after: <Button circular chromeless size={0.9} icon="arrowright" />,
        appConfig: {
          id: `${listId || -1}`,
          subId: `${item.id}`,
          subType: 'folder',
        },
      }
    case 'bit':
      return {
        item: await loadOne(BitModel, { args: { where: { id: +item.id } } }),
      }
  }
  return null
}
