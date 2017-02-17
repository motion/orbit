import view from 'motion-test-view'
import App from '../stores/app'

// make this.app available on all views
@view.inject({
  app: App,
})
export default class ViewRoot {
  componentWillMount() {
    // add events that go away on unmount
    this.addEvent(window, 'click', console.log)
  }

  render() {
    const View = this.app.router.activeView || NotFound

    if (View.noLayout) {
      return <View />
    }

    return (
      <page>
        <h1>Welcome</h1>
        <Page />
      </page>
    )
  }

  static style = {
    h1: {
      color: 'lavendar',
      padding: 100,
    }
  }
}
