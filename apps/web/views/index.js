import { view } from 'helpers'
import App from '../stores/app'
import Router from '../stores/router'
import NotFound from './notfound'

@view
export default class ViewsRoot {
  render() {
    const CurrentPage = Router.activeView || NotFound
    return (
      <page>
        <header $$row $$align="center">
          <h1>motion</h1>
          <nav $$row>
            <a onClick={() => Router.go("/")}>Home</a>
            <a onClick={() => Router.go("/projects")}>Projects</a>
          </nav>
        </header>
        <content>
          <main>
            <CurrentPage />
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
