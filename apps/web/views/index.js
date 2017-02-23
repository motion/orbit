import { view } from 'my-decorators'
import Sidebar from './sidebar'
import App from '../stores/app'
import Router from '../stores/router'
import NotFound from './notfound'

@view
class Test {
  render() {
    console.log(`'sss`, this.app)
    return null
  }
}

@view
export default class ViewsRoot {
  componentWillMount() {
    // add events that go away on unmount
    // this.addEvent(window, 'click', console.log)
  }

  render() {
    const CurrentPage = Router.activeView || NotFound
    return (
      <page>
        <Test />
        <header $$row $$align="center">
          <h1>motion322</h1>
          <nav $$row>
            <a onClick={() => this.router.go("/")}>Home</a>
            <a onClick={() => this.router.go("/projects")}>Projects</a>
          </nav>
        </header>
        <content>
          {/*<Sidebar />*/}
          <main>
            <CurrentPage key={Math.random()} />
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
      flex: 1,
    },
    header: {
      padding: [0, 10],
      margin: 0,
      borderBottom: [1, '#f2f2f2'],
    },
    h1: {
      color: 'purple',
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
