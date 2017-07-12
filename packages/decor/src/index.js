// @flow
import reactMixin from 'react-mixin'
import { Emitter } from 'sb-event-kit'
export { Emitter, CompositeDisposable } from 'sb-event-kit'

console.log('emtiter', Emitter)

type Plugin = () => { decorator?: Function, mixin?: Object }

export default function decor(plugins: Array<Array<Plugin | Object> | Plugin>) {
  const allPlugins = []
  // unique key per decorator instance
  const DECOR_KEY = `__IS_DECOR_DECORATED${Math.random()}`
  const DECOR_GLOBAL_KEY = '__IS_DECOR_DECORATED'
  const emitter = new Emitter()

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

    let plugin = getPlugin(options, emitter)

    if (!plugin.decorator && !plugin.mixin) {
      throw `Bad plugin, needs decorator or mixin ${plugin.name}`
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

    // avoid decorating twice
    if (Klass[DECOR_KEY]) {
      console.log('avoid decorating twice', Klass.name)
      return Klass
    }

    try {
      for (const plugin of allPlugins) {
        if (plugin.mixin && Klass.prototype) {
          reactMixin(Klass.prototype, plugin.mixin)
        }
        if (plugin.decorator) {
          decoratedClass =
            plugin.decorator(decoratedClass, opts) || decoratedClass
        }
      }

      Klass[DECOR_KEY] = true
      Klass[DECOR_GLOBAL_KEY] = true
    } catch (e) {
      console.log('dev mode catching error', e)
    }

    return decoratedClass
  }

  // to listen to plugin events
  decorDecorator.off = emitter.off.bind(emitter)
  decorDecorator.on = emitter.on.bind(emitter)
  decorDecorator.emit = emitter.emit.bind(emitter)

  return decorDecorator
}
