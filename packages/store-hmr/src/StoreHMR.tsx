import * as React from 'react'

let id = 0
const uid = () => {
  id = (id + 1) % Number.MAX_SAFE_INTEGER
  return id
}

export class StoreHMR extends React.Component {
  props: { children: any }

  state = {
    path: uid(),
  }

  render() {
    return React.cloneElement(this.props.children, {
      __hmrPath: this.state.path,
    })
  }
}
