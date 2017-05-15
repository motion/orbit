import { $, view } from '~/helpers'

@view class Loading {
  render() {
    return <spinner>loading</spinner>
  }
}

@view
export default class Page {
  componentWillMount() {
    this.id = Math.random()
    this.setPage(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.setPage(nextProps)
  }

  componentWillUnmount() {
    // ensure removal only if not already replaced
    if (App.activePage.id === this.id) {
      App.activePage = {}
      App.extraActions = null
    }
  }

  setPage = ({ title, actions, extraActions, header, sidebar, doc, place }) => {
    App.extraActions = extraActions
    App.activePage = {
      id: this.id,
      title,
      actions,
      header,
      sidebar,
      doc,
      place,
    }
  }

  render({ children, loading, className }) {
    return (
      <page className={className}>
        {children}
        <Loading if={loading} />
      </page>
    )
  }

  static style = {
    page: {
      flex: 1,
      overflowY: 'scroll',
      padding: 20,
    },
  }
}
