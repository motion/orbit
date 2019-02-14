import { transaction } from 'mobx'
import isEqualReact from 'react-fast-compare'

// updateProps
// granular set so reactions can be efficient
export function updateProps(store: any, nextProps: Object) {
  const nextPropsKeys = Object.keys(nextProps)
  const curPropKeys = Object.keys(store.props)

  // changes
  transaction(() => {
    for (const prop of nextPropsKeys) {
      const a = store.props[prop]
      const b = nextProps[prop]
      if (!isEqualReact(a, b)) {
        store.props[prop] = b
      }
    }

    // removes
    for (const key of curPropKeys) {
      if (typeof nextProps[key] === 'undefined') {
        delete store.props[key]
      }
    }
  })
}
