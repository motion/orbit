import { $, view } from '~/helpers'

@view
export class Page {
  id = Math.random()

  componentWillMount() {
    const { title, actions, header, sidebar } = this.props
    App.views = { _id: this.id, title, actions, header, sidebar }
  }

  componentWillUnmount() {
    // ensure removal only if not already replaced
    if (App.views._id === this.id) {
      App.views = {}
    }
  }

  render({ children }) {
    return (
      <page>
        {children}
      </page>
    )
  }

  static style = {
    page: {
      flex: 1,
    },
  }
}

Page.Side = $('side', {
  width: 200,
  padding: 0,
  flex: 1,
})

Page.Head = $('header', {})
