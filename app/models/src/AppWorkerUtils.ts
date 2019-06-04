import { Logger } from '@o/logger'
import { MediatorClient } from '@o/mediator'
import { EntityManager } from 'typeorm'

import { AppBit } from './interfaces/AppBit'
import { Bit } from './interfaces/Bit'
import { BitContentType } from './interfaces/BitContentType'
import { Location } from './interfaces/Location'

export interface WorkerUtilsConstructor {
  new (
    app: AppBit,
    manager: EntityManager,
    log: Logger,
    mediator: MediatorClient,
    isAborted: () => Promise<boolean>,
  ): WorkerUtilsInstance
}

export interface WorkerUtilsInstance {
  isAborted: () => Promise<boolean>

  loadApps(options?: { identifier: string }): Promise<AppBit[]>

  loadBits(options?: {
    idsOnly?: boolean
    ids?: number[]
    type?: BitContentType
    appIdentifiers?: string[]
    locationId?: string
    bitCreatedAtMoreThan?: number
  }): Promise<Bit[]>

  saveBit(bit: Bit): Promise<void>

  saveBits(bits: Bit[]): Promise<void>

  removeBit(bit: Bit): Promise<void>

  removeBits(bits: Bit[]): Promise<void>

  clearBits(): Promise<void>

  syncBits(
    apiBits: Bit[],
    dbBits: Bit[],
    options?: {
      completeBitsData?: (bits: Bit[]) => void | Promise<void>
    },
  ): Promise<void>

  loadTextTopWords(text: string, max: number): Promise<string[]>

  updateAppData(): Promise<void>

  generateBitId(data: string): number

  createBit(properties: {
    type: BitContentType
    originalId: string
    title: string
    bitUpdatedAt?: number
    bitCreatedAt?: number
    body?: string
    authorId?: number
    email?: string
    photo?: string
    webLink?: string
    desktopLink?: string
    author?: Bit
    people?: Bit[]
    data?: any
    location?: Location
    crawled?: boolean
  }): Bit

  bitContentHash(bit: Bit): number
}
