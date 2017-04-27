import { view, observable } from '~/helpers'
import Router from '~/router'

@view
export default class Link {
  @observable active = false

  componentDidMount() {
    this.watch(() => {
      this.active = Router.path === this.props.to
    })
  }

  onClick = e => {
    e.preventDefault()
    Router.go(this.props.to)
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }
  render({ to, ...props }) {
    return (
      <a $active={this.active} href={to} {...props} onClick={this.onClick} />
    )
  }
  static style = {
    a: {
      color: '#333',
      fontWeight: 200,
      cursor: 'pointer',
    },
    active: {
      fontWeight: 600,
      color: '#000',
      '&:hover': {
        background: 'transparent',
      },
    },
  }
}
