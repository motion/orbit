import { save } from '@mcro/model-bridge';
import { AppModel, Bit, ListsApp } from '@mcro/models';
import { ListsAppIndex } from './ListsAppIndex';
import { ListsAppMain } from './ListsAppMain';

const rootID = 0

export const lists = {
  index: ListsAppIndex,
  main: ListsAppMain,
  actions: {
    // TODO add person
    receive(app: ListsApp, target: Bit, subID?: number) {
      // add to parent
      const parentID = typeof subID === 'number' ? subID : rootID
      const item = app.data.items[parentID]
      item.children.push(item.id)

      // add to hash
      app.data.items[target.id] = {
        id: target.id,
        type: target.target,
        name: target.title,
      }


      // TODO umed type not accepting here
      // @ts-ignore
      save(AppModel, nextApp)
    }
  }
}
