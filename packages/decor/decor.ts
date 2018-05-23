import { Emitter } from 'event-kit'
export { Emitter, CompositeDisposable } from 'event-kit'
import { DecorPlugins, DecorCompiledDecorator } from './decor.d'

export default function decor(
  plugins: DecorPlugins,
): DecorCompiledDecorator<any> {
  const allPlugins = []

  // Helpers
  const emitter = new Emitter()
  const emit = (a, b?) => emitter.emit(a, b)
  const on = (a, b) => emitter.on(a, b)
  const isClass = x =>
    x &&
    x.prototype &&
    (x.toString().indexOf('class ') === 0 ||
      x.toString().indexOf('classCallCheck') > -1)

  // process plugins
  let index = -1
  for (const curPlugin of plugins.filter(x => !!x)) {
    index++
    let getPlugin = curPlugin
    let options = {}
    // array-style config
    if (Array.isArray(curPlugin)) {
      getPlugin = curPlugin[0]
      options = curPlugin[1] || {}
    }
    if (typeof getPlugin !== 'function') {
      console.log('got some bad plugins', plugins)
      throw `Bad plugin at index ${index} (expected a function):
        got type: ${typeof getPlugin}
        value: ${(getPlugin && getPlugin.toString()) || ''}`
    }
    // uid per plugin
    const decoratedStore = new WeakMap()
    const alreadyDecorated = Klass => {
      if (decoratedStore.get(Klass)) {
        return true
      }
      decoratedStore.set(Klass, true)
      return false
    }
    const Helpers = {
      emit,
      on,
      alreadyDecorated,
    }
    const ogPlugin = getPlugin(options, Helpers)
    if (!ogPlugin.decorator) {
      throw `No decorator provided for decor plugin ${ogPlugin.name}`
    }
    const plugin = {
      ...ogPlugin,
      // add helpers for once and onlyClass
      decorator: (Klass, ...args) => {
        if (plugin.once && alreadyDecorated(Klass)) {
          return Klass
        }
        if (plugin.onlyClass && !isClass(Klass)) {
          return Klass
        }
        return ogPlugin.decorator(Klass, ...args)
      },
    }
    allPlugins.push(plugin)
  }

  const decorDecorator = <DecorCompiledDecorator>function decorDecorator(
    KlassOrOpts: Function | Object,
    opts?: Object,
  ) {
    // optional: decorator-side props
    if (typeof KlassOrOpts === 'object') {
      return (NextKlass: Function) => decorDecorator(NextKlass, KlassOrOpts)
    }
    let decoratedClass = KlassOrOpts
    if (!decoratedClass) {
      throw new Error('No class/function passed to decorator')
    }
    for (const plugin of allPlugins) {
      decoratedClass = plugin.decorator(decoratedClass, opts) || decoratedClass
    }
    return decoratedClass
  }

  // to listen to plugin events
  decorDecorator.on = (a, b) => emitter.on(a, b)
  decorDecorator.emit = emit
  decorDecorator.emitter = emitter

  return decorDecorator
}
