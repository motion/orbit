import { view } from 'helpers'

@view
export default class Sidebar {
  render() {
    return (
      <sidebar>
        <section>
          <a>Test thing</a>
          <a>Test thing</a>
          <a>Test thing</a>
          <a>Test thing</a>
          <a>Test thing</a>
        </section>
      </sidebar>
    )
  }

  static style = {
    sidebar: {
      height: '100%',
      width: 160,
      borderRight: [1, '#eee'],
    }
  }
}
