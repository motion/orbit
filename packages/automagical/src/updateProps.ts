import { transaction } from 'mobx'

// updateProps
// granular set so reactions can be efficient
export function updateProps(store: any, nextProps: Object) {
  // a little work avoidance
  if (store.__lastProps === nextProps) return

  const nextPropsKeys = Object.keys(nextProps)
  const curPropKeys = Object.keys(store.props)

  // changes
  transaction(function updateProps() {
    let updated = false

    for (const prop of nextPropsKeys) {
      const a = store.props[prop]
      const b = nextProps[prop]
      if (a === b) continue
      store.props[prop] = b
      updated = true
    }

    // removes
    // for (const key of curPropKeys) {
    //   if (typeof nextProps[key] === 'undefined') {
    //     delete store.props[key]
    //     updated = true
    //   }
    // }

    if (updated) {
      store.__lastProps = nextProps
    }
  })
}
