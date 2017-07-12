// @flow
// import { Howl } from 'howler'

export default class SoundStore {
  sounds = {}

  start() {
    const base = '/sounds'
    const sources = {
      success: 'success/success2.m4a',
      newTask: 'success/complete1.m4a',
    }

    Object.keys(sources).map(name => {
      // this.sounds[name] = new Howl({
      //   src: [`${base}/${sources[name]}`],
      //   volume: 0.2,
      // })
    })

    // make available globally for easy access (particularly within list plugin)
    window.Sound = this
  }

  play = name => {
    this.sounds[name].play()
  }
}
