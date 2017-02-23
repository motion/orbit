import { view } from 'my-decorators'
import { Title, Text, Page, Link } from 'my-views'
import ProjectsStore from './projectsStore'

@view.provide({
  projects: ProjectsStore
})
export default class Projects {
  render() {
    return (
      <Page>
        <Title>{this.projects.x} 2</Title>
        <button onClick={() => this.projects.x++}>increment</button>

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
}

