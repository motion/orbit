import ocr from '@mcro/ocr'

export default class Screen {
  results = []
  options = {}

  start() {
    this.ocrLoop()
  }

  setOptions(options) {
    this.options = options
  }

  async ocrLoop() {
    console.log('ocr')
    await this.ocr()
    this.ocrLoop()
  }

  async ocr() {
    const { offset, bounds } = this.options
    if (!offset || !bounds) {
      throw new Error(`No bounds or offset given`)
    }
    const { boxes } = await ocr(this.options)
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
  }

  state() {
    return this.results
  }
}
