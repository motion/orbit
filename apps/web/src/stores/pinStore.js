import { store } from '@mcro/black'
import { Thing } from '~/app'
import * as r2 from '@mcro/r2'
import * as Constants from '~/constants'
import OraBannerStore from '~/stores/oraBannerStore'

@store
export default class PinStore {
  add = async context => {
    if (!context) {
      console.log('no context to add')
      return
    }
    OraBannerStore.note({ message: 'Pinning...' })
    const { url } = context
    const response = await r2.post(`${Constants.API_URL}/crawler/single`, {
      json: { options: { entry: url } },
    }).json
    if (response.error) {
      OraBannerStore.error({ message: `${response.error}` })
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
      OraBannerStore.success({ message: 'Added pin' })
      return true
    } else {
      OraBannerStore.error({ message: 'Failed pinning :(' })
    }
  }
}
