import { loadOne, useModel, useModelCount, UseModelOptions, useModels } from '@o/bridge'
import { Bit, BitModel } from '@o/models'
import { useScopedStateId } from '@o/ui'
import { useEffect } from 'react'
import { FindOptions } from 'typeorm'

import { useActiveSpace } from './useActiveSpace'
import { useBitHelpers } from './useAppBitHelpers'

function getBitFindOptions(query: FindOptions<Bit> | string | false) {
  const id = useScopedStateId()
  const originalId = `bit-${id}${query}`
  let conditions: FindOptions<Bit> | false = false
  if (query) {
    switch (typeof query) {
      case 'string':
        conditions = {
          where: {
            originalId,
          },
        }
        break
      case 'object':
        conditions = query
        break
    }
  }
  return conditions
}

export function useBit(query: FindOptions<Bit> | string | false, options: UseModelOptions = {}) {
  const findOptions = getBitFindOptions(query)
  const helpers = useBitHelpers()
  const [space] = useActiveSpace()

  // ensure bit exists
  useEffect(() => {
    if (!findOptions) return
    loadOne(BitModel, { args: findOptions }).then(bit => {
      if (!bit) {
        helpers.createOrUpdate({
          originalId: findOptions.where['originalId'],
          spaceId: space.id,
          ...options.defaultValue,
        })
      }
    })
  }, [])

  return useModel(BitModel, findOptions, options)
}

export function useBits(query: FindOptions<Bit> | false, options: UseModelOptions = {}) {
  const findOptions = getBitFindOptions(query)
  const models = useModels(BitModel, findOptions, options)
  return [models, useBitHelpers()]
}

export function useBitsCounts(query: FindOptions<Bit>) {
  return useModelCount(BitModel, query)
}
