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
    return (
      <Page>
        2hello222dxd
      </Page>
    )
  }

  static style = {
  }
}
console.log('top level 2')
