import { $, view } from '~/helpers'
import { pick } from 'lodash'

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
      if (this.props.extraActions) {
        App.extraActions = null
      }
      if (this.hasPageInfo(this.props)) {
        App.activePage = {}
      }
    }
  }

  getPageInfo = props => ({
    id: this.id,
    ...pick(props, [
      'title',
      'actions',
      'extraActions',
      'header',
      'sidebar',
      'doc',
      'place',
    ]),
  })

  hasPageInfo = props => {
    return !!(props.title || props.actions || props.header || props.sidebar)
  }

  setPage = props => {
    if (props.extraActions) {
      App.extraActions = props.extraActions
    }
    if (this.hasPageInfo(props)) {
      App.activePage = this.getPageInfo(props)
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
      padding: 10,
    },
  }
}
