import { store, observable } from 'my-decorators'

@store
export default class ProjectsStore {
  @observable x = 2

  constructor() {
    this.heroes = this.app.models.Hero.byName()
  }

  add() {
    this.x++
  }
}
