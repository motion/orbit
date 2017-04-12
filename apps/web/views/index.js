import { view } from 'helpers'
import NotFound from './notfound'
import Router from '../stores/router'

@view
export default class Layout {
  render() {
    const CurrentPage = Router.activeView || NotFound

    return (
      <layout $$flex>
        <header $$row $$align="center">
          <h1>groop</h1>
          <nav $$row>
            <a onClick={() => Router.go("/")}>home</a>
            <a onClick={() => Router.go("/projects")}>popular</a>
          </nav>
        </header>
        <CurrentPage />
      </layout>
    )
  }

  static style = {
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
