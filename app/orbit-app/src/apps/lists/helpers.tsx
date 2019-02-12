import { loadOne } from '../../mediator'
import { BitModel, ListAppDataItem, PersonBitModel } from '@mcro/models'
import { Button } from '@mcro/ui'
import React from 'react'
import { OrbitListItemProps } from '../../views/ListItems/OrbitListItem'

export async function loadListItem(
  item?: ListAppDataItem,
  listId?: number,
): Promise<OrbitListItemProps> {
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
    case 'person':
      return {
        item: await loadOne(PersonBitModel, { args: { where: { id: +item.id } } }),
      }
  }
  return null
}
