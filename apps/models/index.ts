import 'reflect-metadata'

// export all helpers

export * from './helpers'
export * from './typeorm'

// ⭐️ ADD MODELS HERE:

export * from './job'
export * from './setting'
export * from './bit'
export * from './person'
export * from './person-bit'
export * from './location'

import { Job } from './job'
import { Setting } from './setting'
import { Bit } from './bit'
import { Person } from './person'
import { PersonBit } from './person-bit'

export const modelsList = [Job, Setting, Bit, Person, PersonBit]
