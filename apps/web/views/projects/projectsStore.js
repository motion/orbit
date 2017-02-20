import { store, observable } from 'my-decorators'

@store
export default class ProjectsStore {
  @observable x = 2

  add() {
    this.x++
  }
}
