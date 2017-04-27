import { $, view } from '~/helpers'

@view
export class Page {
  id = Math.random()

  componentWillMount() {
    this.setViews(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setViews(nextProps)
  }

  componentWillUnmount() {
    // ensure removal only if not already replaced
    if (App.views._id === this.id) {
      App.views = {}
    }
  }

  setViews = props => {
    const { title, actions, header, sidebar } = props
    App.views = { _id: this.id, title, actions, header, sidebar }
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
