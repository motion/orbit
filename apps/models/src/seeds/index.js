export homepage from './homepage'

export default class Seed {
  async start(seeds) {
    Object.keys(seeds).map(name => {
      this.runSeed(name, seeds[name])
    })
  }

  runSeed(name, seedFn) {
    console.log('running seed', name)
    seedFn()
  }
}
