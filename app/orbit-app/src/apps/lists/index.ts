import { save } from '@mcro/model-bridge'
import { AppModel, Bit, ListAppDataItem, ListsApp } from '@mcro/models'
import { ListsAppIndex } from './ListsAppIndex'
import { ListsAppMain } from './ListsAppMain'

export const listRootID = 0

export const lists = {
  index: ListsAppIndex,
  main: ListsAppMain,
  actions: {
    // TODO add person
    receive(
      app: ListsApp,
      parentID: number,
      child: Bit | Partial<ListAppDataItem> & { target: 'folder' },
    ) {
      const item = app.data.items[parentID]

      if (item.type !== 'folder' && item.type !== 'root') {
        throw new Error('Invalid parent to add')
      }

      item.children.push(child.id)

      // add to hash
      if (child.target === 'bit') {
        app.data.items[child.id] = {
          id: child.id,
          type: 'bit',
          name: child.title,
        }
      }

      if (child.target === 'folder') {
        const id = Math.random()
        app.data.items[id] = {
          id,
          children: [],
          type: 'folder',
          name: child.name,
          icon: child.icon,
        }
      }

      // TODO umed type not accepting here
      save(AppModel, app as any)
    },
  },
}
