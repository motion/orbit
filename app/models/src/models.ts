import { Model } from '@mcro/mediator'
import { FindOptions, FindOptionsWhere } from 'typeorm'
import { Bit } from './Bit'
import { Job } from './Job'
import { Person } from './Person'
import { PersonBit } from './PersonBit'
import { Setting } from './Setting'

export const BitModel = new Model<Bit, FindOptions<Bit>, FindOptionsWhere<Bit>>('Bit')
export const JobModel = new Model<Job, FindOptions<Job>, FindOptionsWhere<Job>>('Job')
export const PersonBitModel = new Model<PersonBit, FindOptions<PersonBit>, FindOptionsWhere<PersonBit>>('PersonBit')
export const PersonModel = new Model<Person, FindOptions<Person>, FindOptionsWhere<Person>>('Person')
export const SettingModel = new Model<Setting, FindOptions<Setting>, FindOptionsWhere<Setting>>('Setting')