import { useModel, useModelCount, UseModelOptions, useModels } from '@o/bridge'
import { Model } from '@o/mediator'
import { BitModel } from '@o/models'

export function useBit<Args, ModelType extends Model<ModelType, Args, any>>(
  query: Args | false,
  options: UseModelOptions = {},
) {
  return useModel(BitModel, query, options)
}

export function useBits<Args, ModelType extends Model<ModelType, Args, any>>(
  query: Args | false,
  options: UseModelOptions = {},
) {
  return useModels(BitModel, query, options)
}

export const useBitCount = useModelCount.bind(null, BitModel)
