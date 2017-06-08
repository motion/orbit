// @flow
import reactMixin from 'react-mixin'

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

    for (const plugin of allPlugins) {
      if (plugin.mixin && Klass.prototype) {
        reactMixin(Klass.prototype, plugin.mixin)
      }
      if (plugin.decorator) {
        decoratedClass = plugin.decorator(decoratedClass) || decoratedClass
      }
    }

    return decoratedClass
  }
}
