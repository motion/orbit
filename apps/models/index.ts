import 'reflect-metadata'

// export all helpers

export * from './helpers'
export * from './typeorm'

// ⭐️ ADD MODELS HERE:

export * from './job'
export * from './setting'
export * from './bit'
export * from './person'
<<<<<<< HEAD
export * from './person-bit'
=======
>>>>>>> master
export * from './location'

import { Job } from './job'
import { Setting } from './setting'
import { Bit } from './bit'
<<<<<<< HEAD
import { Person } from './person'
import { PersonBit } from './person-bit'
=======
import { Person, PersonBit } from './person'
>>>>>>> master

export const modelsList = [Job, Setting, Bit, Person, PersonBit]
