// @flow
import reactMixin from 'react-mixin'

const DECOR_KEY = '__IS_DECOR_DECORATED'

export default function decor(plugins) {
  const allPlugins = []

  for (const curPlugin of plugins.filter(Boolean)) {
    let getPlugin = curPlugin
    let options = {}

    // array-style config
    if (Array.isArray(curPlugin)) {
      getPlugin = curPlugin[0]
      options = curPlugin[1]
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
