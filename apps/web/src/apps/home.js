import React from 'react'
import { view } from '@mcro/black'
import { CurrentUser } from '~/app'

@view({
  store: class {
    x = 0

    start() {
      this.watch(() => {
        console.log('props are', this.props)
      })
    }
  },
})
class Test extends React.Component {
  render({ store }) {
    return (
      <div>
        what
        {store.props.hello}
        {store.x}
      </div>
    )
  }
}

@view
export default class HomePage extends React.Component {
  state = {
    x: 'thing',
  }

  componentDidMount() {
    this.setTimeout(() => {
      this.setState({ x: 'otherthing' })
    }, 1000)
  }

  render() {
    if (!CurrentUser.loggedIn) {
      return <center $$centered>login plz</center>
    }

    if (CurrentUser.home === null) {
      return <null>weird no org</null>
    }

    return (
      <home $$centered>
        ...
        <Test hello={this.state.x} />
      </home>
    )
  }
}
