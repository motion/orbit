import { AppBit, AppModel, Bit, save } from '@o/kit'

import { ListsAppBit } from './types'

export default (app: AppBit) => {
  return {
    receive(
      parentID: number,
      child:
        | Bit
        | {
            id?: number
            name?: string
            icon?: string
            target: 'folder'
          },
    ) {
      const listApp = app as ListsAppBit
      const item = listApp.data.items[parentID]
      if (!item || (item.type !== 'folder' && item.type !== 'root')) {
        return console.error('NO VALID THING', item, parentID, listApp)
      }
      const id = child.id || Math.random()
      item.children.push(id)
      // add to hash
      if (child.target === 'bit') {
        listApp.data.items[id] = {
          id,
          type: 'bit',
          name: child.title,
        }
      } else if (child.target === 'folder') {
        listApp.data.items[id] = {
          id,
          children: [],
          type: 'folder',
          name: child.name,
          icon: child.icon,
        }
      }
      save(AppModel, app)
    },
  }
}
