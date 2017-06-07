// @flow
import mixin from 'react-mixin'

export default function decor(plugins) {
  const decorators = []
  const mixins = []

  for (const curPlugin of plugins) {
    let getPlugin = curPlugin
    let options = {}

    // array-style config
    if (Array.isArray(curPlugin)) {
      getPlugin = curPlugin[0]
      options = curPlugin[1]
    }

    let plugin = getPlugin(options)

    if (plugin.decorator) {
      decorators.push(plugin.decorator)
    } else if (plugin.mixin) {
      mixins.push(plugin.mixin)
    } else {
      throw `Bad plugin, needs decorator or mixin: ${plugin}`
    }
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
