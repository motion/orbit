const isBrowser = eval(`typeof window !== 'undefined'`)

const {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} = isBrowser ? require('typeorm/browser') : require('typeorm')

export {
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
}

// avoid
export const setGlobal = (name: string, val: any) => {
  let Thing = val
  eval(`${typeof global === 'undefined' ? 'window' : 'global'}.${name} = Thing`)
}
