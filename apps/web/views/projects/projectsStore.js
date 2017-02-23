import { store, observable } from 'my-decorators'
import { fromStream } from 'mobx-utils'

@store
export default class ProjectsStore {
  @observable x = 2
  @observable heroes = null

  constructor() {
    this.heroes = fromStream(this.app.models.Hero.byName())
  }

  insert(name, color) {
    this.app.models.Hero.table.insert({ name, color })
  }
}
