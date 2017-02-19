import { view } from "my-decorators"
import App from "../stores/app"
import Router from "../stores/router"
import NotFound from "./notfound"

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
        <header $$row>
          <h1>Veritas</h1>
          <nav>
            <a onClick={() => this.router.go("/")}>Home</a>
            <a onClick={() => this.router.go("/projects")}>Projects</a>
          </nav>
        </header>
        <Page />
      </page>
    )
  }

  static style = {
    h1: {
      color: "red",
      padding: 10,
    }
  }
}
