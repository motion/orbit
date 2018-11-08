import { AppEntity } from './AppEntity'
import { BitEntity } from './BitEntity'
import { JobEntity } from './JobEntity'
import { PersonBitEntity } from './PersonBitEntity'
import { PersonEntity } from './PersonEntity'
import { SettingEntity } from './SettingEntity'
import { SearchIndexEntity } from './SearchIndexEntity'
import { SourceEntity } from './SourceEntity'
import { SpaceEntity } from './SpaceEntity'

export * from './AppEntity'
export * from './BitEntity'
export * from './JobEntity'
export * from './LocationEntity'
export * from './PersonBitEntity'
export * from './PersonEntity'
export * from './SearchIndexEntity'
export * from './SettingEntity'
export * from './SourceEntity'
export * from './SpaceEntity'

export const Entities = [
  AppEntity,
  BitEntity,
  JobEntity,
  PersonEntity,
  PersonBitEntity,
  SettingEntity,
  SearchIndexEntity,
  SourceEntity,
  SpaceEntity,
]
