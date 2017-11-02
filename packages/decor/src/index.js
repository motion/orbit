// @flow
import reactMixin from 'react-mixin'
import { Emitter } from 'sb-event-kit'
export { Emitter, CompositeDisposable } from 'sb-event-kit'

type Helpers = {
  emitter: Emitter,
  alreadyDecorated: (a: any) => boolean,
}

type Plugin = (
  options: Object,
  Helpers: Helpers
) => {
  name: string,
  once?: boolean,
  onlyClass?: boolean,
  decorator?: (a: Class<any> | Function, b?: Object) => any,
  mixin?: Object,
}

const empty = () => void 0

export default function decor(plugins: Array<[Plugin, Object] | Plugin>) {
  const allPlugins = []

  // Helpers
  const emitter = new Emitter()
  const emit = (...args) => emitter.emit(...args)
  const isClass = x => x && !!x.prototype

  // process plugins
  for (const curPlugin of plugins.filter(x => !!x)) {
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
      emit,
      alreadyDecorated,
    }

    let plugin = getPlugin(options, Helpers)

    if (!plugin.decorator && !plugin.mixin) {
      throw `Bad plugin, needs decorator or mixin ${plugin.name}`
    }

    // apply helpers
    if (plugin.once) {
      const ogPlugin = plugin.decorator || empty
      plugin.decorator = (Klass, ...args) =>
        alreadyDecorated(Klass) ? Klass : ogPlugin(Klass, ...args)
    }
    if (plugin.onlyClass) {
      const ogPlugin = plugin.decorator || empty
      plugin.decorator = (Klass, ...args) =>
        !isClass(Klass) ? Klass : ogPlugin(Klass, ...args)
    }

    allPlugins.push(plugin)
  }

  function decorDecorator(
    KlassOrOpts: Class<any> | Function | Object,
    opts?: Object
  ) {
    // optional: decorator-side props
    if (typeof KlassOrOpts === 'object') {
      return (NextKlass: Class<any> | Function) =>
        decorDecorator(NextKlass, KlassOrOpts)
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
  decorDecorator.off = (...args) => emitter.off(...args)
  decorDecorator.on = (...args) => emitter.on(...args)
  decorDecorator.emit = emit

  return decorDecorator
}
