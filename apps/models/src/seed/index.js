import * as Seeds from './seeds'

export default class Seed {
  async start() {
    Object.keys(Seeds).map(name => {
      this.runSeed(name, Seeds[name])
    })
  }

  runSeed(name, seedFn) {
    console.log('running seed', name, seedFn)
    seedFn()
  }
}
