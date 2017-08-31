// @flow
import reactMixin from 'react-mixin'
import { Emitter } from 'sb-event-kit'
export { Emitter, CompositeDisposable } from 'sb-event-kit'

type Plugin = () => { decorator?: Function, mixin?: Object }

export default function decor(plugins: Array<Array<Plugin | Object> | Plugin>) {
  const allPlugins = []

  // Helpers
  const emitter = new Emitter()
  const isClass = x => !!x.prototype

  // process plugins
  for (const curPlugin of plugins.filter(Boolean)) {
    let getPlugin = curPlugin
    let options = {}

    // array-style config
    if (Array.isArray(curPlugin)) {
      getPlugin = curPlugin[0]
      options = curPlugin[1] || {}
    }

    if (typeof getPlugin !== 'function') {
      throw `Plugin must be a function, got ${typeof getPlugin}`
    }

    // uid per plugin
    const uid = Math.random()
    const alreadyDecorated = Klass => {
      const result = Klass[uid]
      Klass[uid] = true
      return result
    }
    const Helpers = {
      emitter,
      alreadyDecorated,
      isClass,
    }

    let plugin = getPlugin(options, Helpers)

    if (!plugin.decorator && !plugin.mixin) {
      throw `Bad plugin, needs decorator or mixin ${plugin.name}`
    }

    // apply helpers
    if (plugin.once) {
      const ogPlugin = plugin.decorator
      plugin.decorator = Klass =>
        alreadyDecorated(Klass) ? Klass : ogPlugin(Klass)
    }
    if (plugin.onlyClass) {
      const ogPlugin = plugin.decorator
      plugin.decorator = Klass => (!isClass(Klass) ? Klass : ogPlugin(Klass))
    }

    allPlugins.push(plugin)
  }

  function decorDecorator(Klass, opts) {
    const isPassingExtraOptions = typeof Klass === 'object'

    if (isPassingExtraOptions) {
      const realOpts = Klass
      return NextKlass => decorDecorator(NextKlass, realOpts)
    }

    let decoratedClass = Klass

    if (!Klass) {
      console.log(Klass)
      throw new Error(
        'Didnt pass a valid class or function to decorator, see above'
      )
    }

    for (const plugin of allPlugins) {
      if (plugin.mixin && Klass.prototype) {
        reactMixin(Klass.prototype, plugin.mixin)
      }
      if (plugin.decorator) {
        decoratedClass =
          plugin.decorator(decoratedClass, opts) || decoratedClass
      }
    }

    return decoratedClass
  }

  // to listen to plugin events
  decorDecorator.off = emitter.off.bind(emitter)
  decorDecorator.on = emitter.on.bind(emitter)
  decorDecorator.emit = emitter.emit.bind(emitter)

  return decorDecorator
}
