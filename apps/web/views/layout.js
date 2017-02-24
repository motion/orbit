import { view } from 'helpers'

@view
export default class Layout {
  render() {
    return (
      <layout $$flex>
        <header $$row $$align="center">
          <h1>motion</h1>
          <nav $$row>
            <a onClick={() => Router.go("/")}>Home</a>
            <a onClick={() => Router.go("/projects")}>Projects</a>
          </nav>
        </header>
        {this.props.children}
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
