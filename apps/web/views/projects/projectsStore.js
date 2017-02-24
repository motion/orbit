import { Hero } from 'models'
import { store, observable } from 'helpers'

@store
export default class ProjectsStore {
  @observable x = 2
  @observable heroes = Hero.byName().observable

  insert(name, color) {
    Hero.table.insert({ name, color })
  }
}
