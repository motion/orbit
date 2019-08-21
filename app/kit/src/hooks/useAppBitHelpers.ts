import { loadOne, save } from '@o/bridge'
import { isEqual } from '@o/fast-compare'
import { bitContentHash } from '@o/libs'
import { AppBit, Bit, BitModel } from '@o/models'
import { useStoreSimple } from '@o/use-store'

import { useApp } from './useApp'

// TODO this can be shared by workers-kit/syncers
class AppBitsStore {
  // @ts-ignore
  props: {
    app?: AppBit
  }

  create(bit: Bit) {
    return save(BitModel, bit)
  }

  update(bit: Partial<Bit> & Pick<Bit, 'originalId'>) {
    return save(BitModel, bit)
  }

  async createOrUpdate(bit: Partial<Bit> & Pick<Bit, 'originalId'>) {
    if (!bit.originalId) {
      throw new Error(
        `Must provide originalId, which you can choose, in order to determine uniqueness`,
      )
    }
    if (!this.props.app) {
      throw new Error(`Must use within an app`)
    }

    const appId = this.props.app.id
    const appIdentifier = this.props.app.identifier

    if (!appId || !appIdentifier) {
      throw new Error(`Missing appId or appIdentifier`)
    }

    const existing = await loadOne(BitModel, {
      args: {
        where: {
          appId,
          appIdentifier,
          originalId: bit.originalId,
        },
      },
    })
    const next = {
      appIdentifier,
      appId,
      ...(existing || null),
      ...bit,
    }

    if (!isEqual(existing, next)) {
      return await save(BitModel, {
        contentHash: bitContentHash(next),
        ...next,
      })
    }
  }
}

export function useAppBitHelpers() {
  const app = useApp()
  return useStoreSimple(AppBitsStore, { app })
}
