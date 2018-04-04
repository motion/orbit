import 'reflect-metadata'

// export all helpers

export * from './helpers'

// ⭐️ ADD MODELS HERE:

export * from './job'
export * from './setting'
export * from './bit'

import { Job } from './job'
import { Setting } from './setting'
import { Bit } from './bit'

export const modelsList = [Job, Setting, Bit]
