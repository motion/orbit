import { AppEntity } from './AppEntity.node'
import { BitEntity } from './BitEntity.node'
import { JobEntity } from './JobEntity.node'
import { SearchIndexEntity } from './SearchIndexEntity.node'
import { SettingEntity } from './SettingEntity.node'
import { SpaceEntity } from './SpaceEntity.node'
import { StateEntity } from './StateEntity.node'
import { UserEntity } from './UserEntity.node'

// ADD to both blocks when exporting

export * from './AppEntity.node'
export * from './BitEntity.node'
export * from './JobEntity.node'
export * from './LocationEntity.node'
export * from './SearchIndexEntity.node'
export * from './SpaceEntity.node'
export * from './UserEntity.node'
export * from './StateEntity.node'
export * from './SettingEntity.node'

export const Entities = [
  AppEntity,
  BitEntity,
  JobEntity,
  SearchIndexEntity,
  SpaceEntity,
  UserEntity,
  StateEntity,
  SettingEntity,
]
