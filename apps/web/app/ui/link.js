import { view, observable } from '~/helpers'
import Router from '~/router'

@view
export default class Link {
  @observable isActive = false

  componentDidMount() {
    this.watch(() => {
      this.isActive =
        Router.path === this.props.to || Router.path === this.props.match
    })
  }

  onClick = (e: Event) => {
    e.preventDefault()
    Router.go(this.props.to)
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }

  render({ to, match, highlight, active, ...props }) {
    return (
      <a
        $active={this.isActive}
        href={to}
        onDragStart={e => e.preventDefault()}
        onClick={this.onClick}
        {...props}
      />
    )
  }

  static style = {
    a: {
      color: '#333',
      cursor: 'pointer',
    },
    active: {
      color: '#000',
      '&:hover': {
        background: 'transparent',
      },
    },
  }

  static theme = {
    active: ({ active }) => ({ active }),
  }
}
