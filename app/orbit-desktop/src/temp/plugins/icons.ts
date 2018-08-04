import fileIcon from 'file-icon'
import { TMP_DIR } from '../constants'
import Path from 'path'
import Crypto from 'crypto'

const getName = x =>
  Crypto.createHash('md5')
    .update(x)
    .digest('hex')

export default class Icons {
  cache = {}

  async getIcon(path, opts = { size: 64 }) {
    const name = `${getName(path)}.png`
    const destination = Path.join(TMP_DIR, name)
    if (this.cache[name]) {
      return name
    }
    try {
      await fileIcon.file(path, {
        size: opts.size || 64,
        destination,
      })
    } catch (err) {
      console.log('error getting icon', path)
    }
    this.cache[name] = true
    return name
  }
}
