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
      plugin.decorator = (Klass, ...args) =>
        alreadyDecorated(Klass) ? Klass : ogPlugin(Klass, ...args)
    }
    if (plugin.onlyClass) {
      const ogPlugin = plugin.decorator
      plugin.decorator = (Klass, ...args) =>
        !isClass(Klass) ? Klass : ogPlugin(Klass, ...args)
    }

    allPlugins.push(plugin)
  }

  function decorDecorator(KlassOrOpts, opts) {
    // optional: decorator-side props
    if (typeof KlassOrOpts === 'object') {
      return NextKlass => decorDecorator(NextKlass, KlassOrOpts)
    }

    let decoratedClass = KlassOrOpts

    if (!decoratedClass) {
      throw new Error('No class/function passed to decorator')
    }

    for (const plugin of allPlugins) {
      if (plugin.mixin && decoratedClass.prototype) {
        reactMixin(decoratedClass.prototype, plugin.mixin)
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
