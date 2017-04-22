import { view, $ } from '~/helpers'
import Router from '~/router'

@view
export default class Link {
  onClick = e => {
    e.preventDefault()
    Router.go(this.props.to)
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }
  render({ to, ...props }) {
    return <a href={to} {...props} onClick={this.onClick} />
  }
  static style = {
    a: {
      color: 'purple',
      cursor: 'pointer',
    },
  }
}
