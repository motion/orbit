// @flow
import mixin from 'react-mixin'

type Plugin = () => {
  decorator?: Function,
  mixins?: Object,
}

export default function decor(plugins) {
  const decorators = []
  const mixins = []

  for (const plugin of plugins) {
    let plugin = plugin
    let options = {}

    // array-style config
    if (Array.isArray(plugin)) {
      plugin = plugin[0]
      options = plugin[1]
    }

    if (plugin.decorator) {
      decorators.push(plugin.decorator)
    }
    if (plugin.mixin) {
      mixins.push(plugin.mixin)
    }
    throw `Bad plugin ${name}, needs decorator or mixin`
  }

  return function decorDecorator(Klass) {
    let decoratedClass = Klass
    for (const decorator of decorators) {
      decoratedClass = decorator(decoratedClass)
    }
    for (const mixin of mixins) {
      mixin(Klass.prototype, mixin)
    }
    return decoratedClass
  }
}
