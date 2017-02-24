import { store, observable } from 'helpers'
import { fromStream } from 'mobx-utils'

@store
export default class ProjectsStore {
  @observable x = 2
  @observable.ref heroes = null

  constructor() {
    this.heroes = fromStream(this.app.models.Hero.byName().$)
  }

  insert(name, color) {
    this.app.models.Hero.table.insert({ name, color })
  }
}
