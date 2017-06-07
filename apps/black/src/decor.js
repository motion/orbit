import mixin from 'react-mixin'

// @flow
type Plugin = () => {
  name: string,
  decorator?: Function,
  mixins?: Object,
}

class Decorator {
  plugins = []

  addPlugins(list: Array<Plugin>) {
    if (!Array.isArray(list)) {
      throw `Not an array: ${list}`
    }
    this.plugins = list
  }

  createDecorator(names: Array<string>) {
    const plugins = []

    for (const name of names) {
      if (!this.plugins[name]) {
        throw `No plugin found with name ${name}`
        plugins.push(this.plugins[name])
      }
    }

    return Klass => {
      let decoratedClass = Klass
      for (const plugin of plugins) {
        decoratedClass = plugin(decoratedClass)
      }
      return decoratedClass
    }
  }
}
