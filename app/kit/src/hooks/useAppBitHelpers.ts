import { loadOne, save } from '@o/bridge'
import { isEqual } from '@o/fast-compare'
import { bitContentHash } from '@o/libs'
import { AppBit, Bit, BitModel } from '@o/models'
import { useStoreSimple } from '@o/use-store'

import { useApp } from './useApp'

// TODO this can be shared by workers-kit/syncers

export class BitHelpersStore {
  // @ts-ignore
  props: {
    app?: AppBit
  }

  get defaultBitProps(): Partial<Bit> {
    const { app } = this.props
    if (!app) return null
    return {
      appId: app.id,
      appIdentifier: app.identifier,
    }
  }

  create(bit: Bit) {
    return this.update(bit)
  }

  update(bit: Partial<Bit> & Pick<Bit, 'originalId'>) {
    return save(BitModel, {
      contentHash: bitContentHash(bit as any),
      ...bit,
      ...this.defaultBitProps,
    })
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
    const existing = await loadOne(BitModel, {
      args: {
        where: {
          ...this.defaultBitProps,
          originalId: bit.originalId,
        },
      },
    })
    const next = {
      ...this.defaultBitProps,
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

export function useBitHelpers() {
  const app = useApp()
  return useStoreSimple(BitHelpersStore, { app })
}
