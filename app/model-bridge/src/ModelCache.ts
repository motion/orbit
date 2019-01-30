import { Model } from '@mcro/mediator'

export interface ModelCacheInstance {
  model: Model<any>
  id: any
  value: any
}

export const ModelCache = {

  instances: [] as ModelCacheInstance[],

  set(model: Model<any>, value: any) {
    const id = value.id // "id" is hardcoded, hope its temporary
    if (!id)
      throw new Error(`Given model value doesn't have id, cannot cache it.`)
    this.instances.push({ model, id, value })
  },

  get(model: Model<any>, id: any) {
    return this.instances.find(instance => {
      return instance.model === model && instance.id === id
    })
  }

}
