import { loadOne, useModel, useModelCount, UseModelOptions, useModels } from '@o/bridge'
import { Bit, BitModel } from '@o/models'
import { ImmutableUpdateFn, useScopedStateId } from '@o/ui'
import { useCallback, useEffect } from 'react'
import { FindOptions } from 'typeorm'

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

export function useBit(
  query: FindOptions<Bit> | string | false,
  options: UseModelOptions = {},
): [Bit, ImmutableUpdateFn<Bit>] {
  const findOptions = getBitFindOptions(query)
  const helpers = useBitHelpers()

  // ensure bit exists
  useEffect(() => {
    if (!findOptions) return
    loadOne(BitModel, { args: findOptions }).then(bit => {
      if (!bit) {
        helpers.createOrUpdate({
          originalId: findOptions.where['originalId'],
          ...options.defaultValue,
        })
      }
    })
  }, [])

  const [bit, updateBitRaw] = useModel(BitModel, findOptions, options)

  // adds contentHash, spaceId, appId, etc
  const updateBit = useCallback(updaterFn => {
    return updateBitRaw(nextBit => {
      const res = updaterFn(nextBit)
      const ctrlProps = helpers.getControlledBitProps(nextBit)
      // handle both immer style returns
      if (!res) {
        for (const key in ctrlProps) {
          nextBit[key] = ctrlProps[key]
        }
      } else {
        return { ...res, ...ctrlProps }
      }
    })
  }, [])

  return [bit, updateBit]
}

export function useBits(query: FindOptions<Bit> | false, options: UseModelOptions = {}) {
  const findOptions = getBitFindOptions(query)
  const models = useModels(BitModel, findOptions, options)
  return [models[0], useBitHelpers()] as const
}

export function useBitsCounts(query: FindOptions<Bit>) {
  return useModelCount(BitModel, query)
}
