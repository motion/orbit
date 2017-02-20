import { view } from 'my-decorators'
import { Page } from 'my-views'
import ProjectsStore from './projectsStore'

@view.provide({
  projects: ProjectsStore,
})
export default class Projects {
  render() {
    return (
      <Page>
        <h2>Projects {this.projects.x}</h2>
        <button onClick={this.projects.add}>click</button>
      </Page>
    )
  }
}
