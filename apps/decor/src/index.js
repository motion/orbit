// @flow
import reactMixin from 'react-mixin'

export default function decor(plugins) {
  const allPlugins = []
  // unique key per decorator instance
  const DECOR_KEY = `__IS_DECOR_DECORATED${Math.random()}`

  for (const curPlugin of plugins.filter(Boolean)) {
    let getPlugin = curPlugin
    let options = {}

    // array-style config
    if (Array.isArray(curPlugin)) {
      getPlugin = curPlugin[0]
      options = curPlugin[1]
    }

    if (typeof getPlugin !== 'function') {
      throw `Plugin must be a function, got ${typeof getPlugin}`
    }

    let plugin = getPlugin(options)

    if (!plugin.decorator && !plugin.mixin) {
      throw `Bad plugin, needs decorator or mixin: ${plugin}`
    }

    allPlugins.push(plugin)
  }

  return function decorDecorator(Klass) {
    let decoratedClass = Klass

    if (!Klass) {
      throw `Didnt pass a valid class or function to decorator`
    }

    // avoid decorating twice
    if (Klass[DECOR_KEY]) {
      console.log('avoid decorating twice', Klass)
      return Klass
    }

    for (const plugin of allPlugins) {
      if (plugin.mixin && Klass.prototype) {
        reactMixin(Klass.prototype, plugin.mixin)
      }
      if (plugin.decorator) {
        decoratedClass = plugin.decorator(decoratedClass) || decoratedClass
      }
    }

    Klass[DECOR_KEY] = true

    return decoratedClass
  }
}
