import { AppBit, Bit, BitEntity } from '@mcro/models'
import { getRepository, In, MoreThan } from 'typeorm'

/**
 * Executes common syncer queries.
 */
export class SyncerRepository {
  private app: AppBit

  constructor(app: AppBit) {
    this.app = app
  }

  /**
   * Loads bits in a given period.
   */
  async loadDatabaseBits(options?: {
    ids?: number[]
    locationId?: string
    oldestMessageId?: string
  }): Promise<Bit[]> {
    if (!options) options = {}
    return getRepository(BitEntity).find({
      select: {
        id: true,
        contentHash: true,
      },
      where: {
        id: options.ids ? In(options.ids) : undefined,
        appId: this.app.id,
        location: {
          id: options.locationId ? options.locationId : undefined,
        },
        bitCreatedAt: options.oldestMessageId
          ? MoreThan(parseInt(options.oldestMessageId) * 1000)
          : undefined,
      },
    })
  }

  /**
   * Loads all exist database people for the current App.
   */
  async loadDatabasePeople(options?: { ids?: number[] }): Promise<Bit[]> {
    if (!options) options = {}
    return getRepository(BitEntity).find({
      where: {
        id: options.ids ? In(options.ids) : undefined,
        type: 'person',
        appId: this.app.id,
      },
    })
  }
}
