import { store } from '@mcro/black'
import { Thing } from '~/app'
import * as r2 from '@mcro/r2'
import * as Constants from '~/constants'
import * as BannerStore from '~/stores/oraBannerStore'

@store
export default class PinStore {
  add = async ({ url } = {}) => {
    if (!url) {
      throw new Error(`No url provided to context`)
    }
    BannerStore.note({ message: 'Pinning...' })
    const response = await r2.post(`${Constants.API_URL}/crawler/single`, {
      json: { options: { entry: url } },
    }).json
    if (response.error) {
      BannerStore.error({ message: `${response.error}` })
      return
    }
    const { result } = response
    if (result) {
      try {
        await Thing.createFromPin(result)
        BannerStore.success({ message: 'Added pin' })
        return true
      } catch (err) {
        BannerStore.error({ message: `${err.message}` })
      }
    } else {
      BannerStore.error({ message: 'Failed pinning :(' })
    }
  }

  remove = async context => {
    try {
      const thing = await Thing.findOne({ url: context.url })
      if (thing) {
        await thing.remove()
        BannerStore.success({ message: 'Removed pin' })
      }
    } catch (err) {
      BannerStore.error({ message: `Error: ${err.message}` })
    }
  }
}
