import ocr from '@mcro/ocr'

const sleep = ms => new Promise(res => setTimeout(res, ms))

export default class Screen {
  started = false
  results = []
  options = {}

  start() {
    if (!this.started) {
      this.started = true
      this.ocrLoop()
    }
  }

  stop() {
    this.started = false
  }

  setOptions(options) {
    console.log('setOptions(options)', options)
    this.options = options
  }

  async ocrLoop() {
    await this.ocr()
    if (this.started) {
      this.ocrLoop()
    }
  }

  async ocr() {
    console.log('running ocr', this.options)
    const { offset, bounds } = this.options
    if (!offset || !bounds) {
      await sleep(100)
      return
    }
    try {
      const res = await ocr(this.options)
      console.log('got', res)
      const { boxes } = res
      this.results = boxes.map(({ name, weight, box }) => {
        const left = offset[0] + box[0]
        const topOffset = 24
        const top = offset[1] + box[1] - topOffset
        const width = offset[0] + box[2] - left
        const height = offset[1] + box[3] - top - topOffset
        return {
          word: name,
          weight,
          top,
          left,
          width,
          height,
        }
      })
    } catch (err) {
      console.log('error with ocr', err.message, err.stack)
    }
  }

  state() {
    return this.results
  }
}
