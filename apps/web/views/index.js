import { view } from "my-decorators"
import App from "../stores/app"
import Router from "../stores/router"
import NotFound from "./notfound"

@view class Sidebar {
  render() {
    return (
      <sidebar>
        <section>
          <a>Test thing</a>
          <a>Test thing</a>
          <a>Test thing</a>
          <a>Test thing</a>
          <a>Test thing</a>
        </section>
      </sidebar>
    )
  }

  static style = {
    sidebar: {
      height: '100%',
      width: 160,
      borderRight: [1, '#eee'],
    }
  }
}

// here we can inject things into every view
// ideally this is minimal
@view.inject({
  router: Router,
  app: App
})
export default class ViewsRoot {
  componentWillMount() {
    // add events that go away on unmount
    this.addEvent(window, "click", console.log)
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
          <Sidebar />
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
    },
    header: {
      borderBottom: [1, '#f2f2f2'],
    },
    h1: {
      color: "red",
      padding: 10,
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
