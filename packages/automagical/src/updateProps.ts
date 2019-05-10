import { transaction } from 'mobx'

// updateProps
// granular set so reactions can be efficient
export function updateProps(store: any, nextProps: Object) {
  // a little work avoidance
  if (store.__lastProps === nextProps) return
  store.__lastProps = nextProps

  const nextPropsKeys = Object.keys(nextProps)
  const curPropKeys = Object.keys(store.props)

  // changes
  transaction(() => {
    for (const prop of nextPropsKeys) {
      const a = store.props[prop]
      const b = nextProps[prop]
      if (a === b) continue
      store.props[prop] = b
    }

    // removes
    for (const key of curPropKeys) {
      if (typeof nextProps[key] === 'undefined') {
        delete store.props[key]
      }
    }
  })
}
