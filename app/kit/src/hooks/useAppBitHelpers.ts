import { loadOne, save } from '@o/bridge'
import { isEqual } from '@o/fast-compare'
import { bitContentHash } from '@o/libs'
import { AppBit, Bit, BitModel, Space } from '@o/models'
import { useStoreSimple } from '@o/use-store'

import { useActiveSpace } from './useActiveSpace'
import { useApp } from './useApp'

// TODO this can be shared by workers-kit/syncers

export class BitHelpersStore {
  // @ts-ignore
  props: {
    app?: AppBit
    space?: Space
  }

  get defaultBitProps(): Partial<Bit> {
    const { app, space } = this.props
    if (!app) return null
    return {
      appId: app.id,
      appIdentifier: app.identifier,
      spaceId: space.id,
    }
  }

  create(bit: Bit) {
    return this.update(bit)
  }

  update(bit: Partial<Bit> & Pick<Bit, 'originalId'>) {
    return save(BitModel, { ...bit, ...this.getControlledBitProps(bit) })
  }

  getControlledBitProps(bit: Partial<Bit>) {
    return {
      ...this.defaultBitProps,
      contentHash: bitContentHash(bit as any),
    }
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
  const [space] = useActiveSpace()
  return useStoreSimple(BitHelpersStore, { app, space })
}
