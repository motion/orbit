import { store } from '@mcro/black'
import { Thing } from '~/app'
import * as r2 from '@mcro/r2'
import * as Constants from '~/constants'

@store
export default class PinStore {
  add = async context => {
    if (!context) {
      console.log('no context to add')
      return
    }
    this.emit('banner', { type: 'note', message: 'Pinning...' })
    const { url } = context
    const response = await r2.post(`${Constants.API_URL}/crawler/single`, {
      json: { options: { entry: url } },
    }).json
    if (response.error) {
      this.emit('banner', { type: 'error', message: `${response.error}` })
      return
    }
    const { result } = response
    if (result) {
      const { url } = result
      const { title, content } = result.contents
      await Thing.create({
        title,
        integration: 'pin',
        type: 'site',
        body: content,
        url,
        bucket: this.bucket || 'Default',
      })
      this.emit('banner', { type: 'success', message: 'Added pin' })
      return true
    } else {
      this.emit('banner', { type: 'error', message: 'Failed pinning :(' })
    }
  }
}
