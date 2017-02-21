import { view } from 'my-decorators'
import Sidebar from './sidebar'
import App from '../stores/app'
import Router from '../stores/router'
import NotFound from './notfound'

// inject things into *all* views (ideally this is minimal)
@view.inject({
  app: App,
  router: Router,
})
export default class ViewsRoot {
  componentWillMount() {
    // add events that go away on unmount
    this.addEvent(window, 'click', console.log)
  }

  render() {
    const Page = this.router.activeView || NotFound
    return (
      <page>
        <header $$row $$align="center">
          <h1>Veritas</h1>
          <nav $$row>
            <a onClick={() => this.router.go("/")}>Home</a>
            <a onClick={() => this.router.go("/projects")}>Projects</a>
          </nav>
        </header>
        <content>
          {/*<Sidebar />*/}
          <main>
            <Page />
          </main>
        </content>
      </page>
    )
  }

  static style = {
    page: {
      flex: 1,
    },
    content: {
      flexFlow: 'row',
      flex: 1,
    },
    main: {
      padding: 10,
      flex: 1,
    },
    header: {
      padding: [0, 10],
      borderBottom: [1, '#f2f2f2'],
      background: 'azure',
    },
    h1: {
      color: 'red',
      padding: [5, 10],
      fontSize: 20,
    },
    a: {
      padding: [1, 6],
      margin: [0, 3],
      cursor: 'pointer',
      '&:hover': {
        background: '#f2f2f2',
      },
    },
  }
}
