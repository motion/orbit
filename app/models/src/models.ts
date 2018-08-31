import { Model } from '@mcro/mediator'
import { FindOptions } from 'typeorm'
import { Bit } from './Bit'
import { Job } from './Job'
import { Person } from './Person'
import { PersonBit } from './PersonBit'
import { Setting } from './Setting'

export const BitModel = new Model<Bit, FindOptions<Bit>>('Bit')
export const JobModel = new Model<Job, FindOptions<Job>>('Job')
export const PersonBitModel = new Model<PersonBit, FindOptions<PersonBit>>('PersonBit')
export const PersonModel = new Model<Person, FindOptions<Person>>('Person')
export const SettingModel = new Model<Setting, FindOptions<Setting>>('Setting')