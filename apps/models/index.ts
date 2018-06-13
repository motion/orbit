import 'reflect-metadata'

// export all helpers

export * from './helpers'
export * from './typeorm'

// ⭐️ ADD MODELS HERE:

export * from './job'
export * from './setting'
export * from './bit'
export * from './person'

import { Job } from './job'
import { Setting } from './setting'
import { Bit } from './bit'
import { Person } from './person'

export const modelsList = [Job, Setting, Bit, Person]
