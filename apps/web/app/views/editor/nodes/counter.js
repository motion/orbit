import { Editor, Raw } from 'slate'
import { node, view, observable } from '~/helpers'

@node
@view
export default class Counter {
  diff = num => {
    const { node: { data }, onChange } = this.props
    const next = data.set('count', (data.get('count') || 0) + num)
    onChange(next)
  }

  render() {
    const { node: { data } } = this.props

    return (
      <div contentEditable="false">
        <h1>
          count is {data.get('count')}
        </h1>
        <a
          onClick={() => {
            this.props.onDestroy()
          }}
        >
          close
        </a>
        <button onClick={() => this.diff(1)}>up</button>
        <button onClick={() => this.diff(-1)}>down</button>
      </div>
    )
  }

  static style = {}
}
