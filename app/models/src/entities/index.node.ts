import { AppBitEntity } from './AppBitEntity.node'
import { BitEntity } from './BitEntity.node'
import { JobEntity } from './JobEntity.node'
import { SearchIndexEntity } from './SearchIndexEntity.node'
import { SettingEntity } from './SettingEntity.node'
import { SpaceEntity } from './SpaceEntity.node'
import { UserEntity } from './UserEntity.node'

// ADD to both blocks when exporting

export * from './AppBitEntity.node'
export * from './BitEntity.node'
export * from './JobEntity.node'
export * from './LocationEntity.node'
export * from './SearchIndexEntity.node'
export * from './SettingEntity.node'
export * from './SpaceEntity.node'
export * from './UserEntity.node'

export const Entities = [
  AppBitEntity,
  BitEntity,
  JobEntity,
  SettingEntity,
  SearchIndexEntity,
  SpaceEntity,
  UserEntity,
]
