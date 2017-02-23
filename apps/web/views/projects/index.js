import { view } from 'my-decorators'
import { Title, Text, Page, Link } from 'my-views'
import feed from './data'
import ProjectsStore from './projectsStore'

const BG_IMG = 'http://www.reportermagazin.cz/img/58a70a569c400e1e0d4e5d9b/2560/1600?_sig=zBGa0KJC_-ci1FqMG4jJZiJzu-zwWrJEDXBqSeKyO-g'

@view.provide({
  projects: ProjectsStore
})
export default class Projects {
  render() {
    console.log(this)
    return (
      <Page>
        {(this.projects.heroes.current || []).map(hero =>
          <hero key={Math.random()}>
            {hero.name || 'none'} {hero.color || 'none'}
          </hero>
        )}

        name <input ref={x => this.name = x} />
        color <input ref={x => this.color = x} />
        <button onClick={() => this.projects.insert(this.name.value, this.color.value)}>insert hero</button>
      </Page>
    )
  }

  static style = {
  }
}
console.log('top level 2')
