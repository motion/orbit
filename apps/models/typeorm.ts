const isBrowser = typeof window !== 'undefined'
const typeorm = isBrowser
  ? require('typeorm/browser')
  : eval(`require('typeorm')`)

const {
  BaseEntity,
  Index,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  getConnection,
  OneToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} = typeorm

export {
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  BaseEntity,
  Index,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  getConnection,
  OneToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
}

// globals
if (isBrowser) {
  // @ts-ignore
  window.typeorm = typeorm
} else {
  // @ts-ignore
  global.typeorm = typeorm
}

// avoid typescript being mad
export const setGlobal = (name: string, val: any) => {
  // @ts-ignore
  let Thing = val
  eval(`${typeof global === 'undefined' ? 'window' : 'global'}.${name} = Thing`)
}
