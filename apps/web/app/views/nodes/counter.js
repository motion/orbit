import { Editor, Raw } from 'slate'
import { node, view, observable } from '~/helpers'

@node
@view
export default class Counter {
  diff = num => {
    const { node: { data }, onChange } = this.props

    const next = Object.assign({}, data.toJS(), {
      count: (data.get('count') || 0) + num,
    })

    onChange(next)
  }

  render() {
    const { node: { data } } = this.props

    return (
      <div contenteditable="false">
        <h1 abc={'' + false} contenteditable={false}>
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
